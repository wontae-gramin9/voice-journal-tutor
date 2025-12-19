import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IAudioStorage } from '@modules/audio/interfaces/audio-storage.interface';

@Injectable()
export class LocalFileStorageService implements IAudioStorage {
  private readonly logger = new Logger(LocalFileStorageService.name);
  private readonly UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'audio');

  constructor() {
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists() {
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true }); // 부모 디렉토리가 없으면 에러 대신 생성
      this.logger.log(`Created upload directory at ${this.UPLOAD_DIR}`);
    }
  }

  private getLocalFilePath(uuid: string): string {
    return path.join(this.UPLOAD_DIR, `${uuid}.audio`);
  }

  async uploadAudio(uuid: string, fileData: Buffer): Promise<string> {
    const filePath = this.getLocalFilePath(uuid);
    await fs.promises.writeFile(filePath, fileData);
    this.logger.log(`Uploaded audio file: ${filePath}`);
    return filePath; // 로컬 경로는 이후 Azure key/URL로 대체
  }

  getPlaybackUrl(uuid: string): string {
    // Controller에서 이 uuid로 getAudioFileStream() 호출하도록 설계
    return `/audio/play/${uuid}`;
  }

  getAudioFileStream(filePath: string): NodeJS.ReadableStream {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Audio file not found: ${filePath}`);
    }
    return fs.createReadStream(filePath);
  }
}
