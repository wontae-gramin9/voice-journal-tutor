import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AudioService } from './audio.service';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { AudioMetadata } from './interfaces/audio-storage.interface';

// *주의: Multer의 파일 업로드 버퍼 제한을 늘려야 할 수 있음(기본 1MB)
// *참고: express.json({ limit: '10mb' }) 등 Appmodule에서 설정 필요
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  // GET /audio/list?after=ISO_DATE
  @Get('list')
  async getMetadatas(@Query('after') after: string): Promise<AudioMetadata[]> {
    if (!after) {
      const defaultDateOneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      return await this.audioService.getMetadatas(defaultDateOneDayAgo);
    }
    return await this.audioService.getMetadatas(after);
  }

  @Get(':uuid')
  async getAudioInfo(@Param('uuid') uuid: string) {
    return await this.audioService.getAudioInfo(uuid);
  }

  @Post('/:uuid')
  @UseInterceptors(FileInterceptor('audioFile')) // 클라이언트가 'audioFile' 폼 데이터 필드로 파일 전송한다고 가정
  async uploadAudio(@Param('uuid') uuid: string, @UploadedFile() file: Express.Multer.File): Promise<AudioMetadata> {
    if (!file) {
      throw new BadRequestException('No audio file uploaded');
    }
    return this.audioService.uploadAudio(uuid, file);
  }

  // 추가 엔드포인트: 로컬 환경에서 재생 URL이 API 경로인 경우
  @Get('play/:uuid')
  async streamAudio(@Param('uuid') uuid: string, @Req() req: Request, @Res() res: Response) {
    const { metadata } = await this.audioService.getAudioInfo(uuid);
    // 브라우저가 보낸 Range header 파싱
    const range = req.headers.range;
    let httpStatus = 200;
    let start = 0;
    let fileSize = metadata.size;
    if (range) {
      httpStatus = 206;
      // Range 헤더가 있는 경우 부분 스트리밍 처리
      // 옮긴 슬라이더에 따라 특정 범위의 오디오를 재생하려면 Range 헤더를 처리하는 로직이 필요, HTTP 206 Partial Content
      const parts = range.replace(/bytes=/, '').split('-');
      start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : metadata.size - 1;
      fileSize = end - start + 1;
      res.set({
        'Content-Range': `bytes ${start}-${end}/${metadata.size}`,
        'Accept-Ranges': 'bytes',
      });
    }
    res.writeHead(httpStatus, {
      'Content-Length': fileSize,
      'Content-Type': metadata.mimeType,
    });
    const audioFileStream = await this.audioService.getAudioFileStream(metadata.fileName, start, fileSize);
    audioFileStream.pipe(res); // 전체 스트림 전송, HTTP 200 OK
    audioFileStream.on('error', (err) => {
      throw new Error(`Error streaming audio file: ${err.message}`);
      res.end();
    });
  }
}
