import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IAudioStorage } from '@modules/audio/interfaces/audio-storage.interface';
import { getSafeIsoTimestamp } from '@utils/time.util';
import { getExtensionFromMime } from '@utils/audio.util';

@Injectable()
export class LocalFileStorageService implements IAudioStorage {
  private readonly logger = new Logger(LocalFileStorageService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'audio');

  constructor() {
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true }); // 부모 디렉토리가 없으면 에러 대신 생성
      this.logger.log(`Created upload directory at ${this.uploadDir}`);
    }
  }

  private generateFileName(uuid: string, extension: string): string {
    return `${uuid}_${getSafeIsoTimestamp(new Date())}${extension}`;
  }

  private getAbsoluteFilePath(fileName: string): string {
    return path.join(this.uploadDir, fileName);
  }

  async uploadAudio(uuid: string, fileData: Buffer, mimeType: string): Promise<string> {
    const extension = getExtensionFromMime(mimeType);
    const fileName = this.generateFileName(uuid, extension);

    const filePath = this.getAbsoluteFilePath(fileName);
    await fs.promises.writeFile(filePath, fileData);
    this.logger.log(`Uploaded audio file: ${filePath}`);
    return fileName; // 로컬 경로는 이후 Azure key/URL로 대체
  }

  getPlaybackUrl(uuid: string): string {
    // Controller에서 이 uuid로 getAudioFileStream() 호출하도록 설계
    return `/audio/play/${uuid}`;
  }

  getAudioFileStream(fileName: string): NodeJS.ReadableStream {
    const absoluteFilePath = this.getAbsoluteFilePath(fileName);
    if (!fs.existsSync(absoluteFilePath)) {
      throw new Error(`Audio file not found: ${absoluteFilePath}`);
    }
    return fs.createReadStream(absoluteFilePath);
  }
}
