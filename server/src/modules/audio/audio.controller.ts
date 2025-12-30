import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
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
  async streamAudio(@Param('uuid') uuid: string, @Res() res: Response) {
    const { metadata } = await this.audioService.getAudioInfo(uuid);
    const audioFileStream = await this.audioService.getAudioFileStream(metadata.fileName);
    res.setHeader('Content-Type', metadata.mimeType);
    audioFileStream.pipe(res);
  }
}
