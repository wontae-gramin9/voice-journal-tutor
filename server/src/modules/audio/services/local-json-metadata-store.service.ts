import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AudioMetadata, IAudioMetadataStore } from '@modules/audio/interfaces/audio-storage.interface';

@Injectable()
export class LocalJsonMetadataStoreService implements IAudioMetadataStore {
  private readonly logger = new Logger(LocalJsonMetadataStoreService.name);
  private readonly METADATA_FILE = path.join(process.cwd(), 'audio-metadata.json');
  private metadata: AudioMetadata[] = [];
  constructor() {
    this.loadMetadataFromFile();
  }

  private loadMetadataFromFile() {
    if (fs.existsSync(this.METADATA_FILE)) {
      try {
        const data = fs.readFileSync(this.METADATA_FILE, 'utf-8');
        this.metadata = JSON.parse(data) as AudioMetadata[];
        this.logger.log(`Loaded metadata from ${this.METADATA_FILE}`);
      } catch (error) {
        this.logger.error(`Failed to load metadata: ${error}`);
        this.metadata = [];
      }
    } else {
      this.logger.log(`Metadata file not found, starting with empty metadata.`);
    }
  }

  private async saveMetadataToFile(): Promise<void> {
    const data = JSON.stringify(this.metadata, null, 2);
    await fs.promises.writeFile(this.METADATA_FILE, data);
    this.logger.log(`Saved metadata to ${this.METADATA_FILE}`);
  }

  async saveMetadata(metadata: AudioMetadata): Promise<void> {
    const index = this.metadata.findIndex((m) => m.uuid === metadata.uuid);
    if (index >= 0) {
      this.metadata[index] = metadata; // 있으면 업데이트
    } else {
      this.metadata.push(metadata); // 없으면 추가
    }
    await this.saveMetadataToFile();
  }

  getMetadata(uuid: string): AudioMetadata | null {
    return this.metadata.find((m) => m.uuid === uuid) || null;
  }

  getRecordings(after: string): AudioMetadata[] {
    const afterDate = new Date(after);
    if (isNaN(afterDate.getTime())) {
      throw new Error('Invalid ISO date format for "after" parameter.');
    }
    // 업로드 시간 기준 내림차순 정렬 후 필터링
    return this.metadata
      .filter((m) => new Date(m.uploadedAt).getTime() > afterDate.getTime())
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
}
