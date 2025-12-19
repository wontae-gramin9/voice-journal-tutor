import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IAudioStorage, IAudioMetadataStore, AudioMetadata } from './interfaces/audio-storage.interface';
import { AUDIO_STORAGE_SERVICE, AUDIO_METADATA_STORE } from './audio.constants';
import { getExtensionFromMime } from '@utils/audio.util';

@Injectable()
export class AudioService {
  // 이 서비스는 인터페이스를 주입받아 비즈니스 로직을 처리하므로
  // 실제 저장 방식 (로컬/클라우드 등)을 알 필요가 없습니다.
  constructor(
    // Module에서 제공한 구현체가 토큰을 사용하여 주입됩니다.
    @Inject(AUDIO_STORAGE_SERVICE)
    private readonly audioStorage: IAudioStorage, // 현재 LocalFileStorageService
    @Inject(AUDIO_METADATA_STORE)
    private readonly metadataStore: IAudioMetadataStore, // 현재 LocalJsonMetadataStoreService
  ) {}

  /**
   * 오디오 파일을 저장하고 메타데이터를 생성합니다.
   * @param uuid
   * @param file 클라이언트로부터 받은 Audio 파일
   */
  async uploadAudio(uuid: string, file: Express.Multer.File): Promise<AudioMetadata> {
    const filePath = await this.audioStorage.uploadAudio(uuid, file.buffer, file.mimetype);
    const extension = getExtensionFromMime(file.mimetype);

    const metadata: AudioMetadata = {
      uuid,
      name: 'New Recoding' + uuid.substring(0, 4), // 임시 이름, 실제로는 클라이언트에서 받아야 함
      mimeType: file.mimetype,
      size: file.size,
      filePath,
      extension,
      uploadedAt: new Date(),
    };
    await this.metadataStore.saveMetadata(metadata);
    return metadata;
  }

  /**
   * GET /audio/:uuid
   * Promise 이전에.
   * @param uuid
   */
  getAudioInfo(uuid: string): { metadata: AudioMetadata; playbackUrl: string } {
    const metadata = this.metadataStore.getMetadata(uuid);
    if (!metadata) {
      throw new NotFoundException(`Audio with ID ${uuid} not found`);
    }
    const playbackUrl = this.audioStorage.getPlaybackUrl(uuid);
    return { metadata, playbackUrl };
  }

  /**
   * 오디오 파일의 스트림을 반환합니다.
   * 로컬파일 시스템에서만 사용되며, Azure 환경에서는 URL로 대체함
   * @param filePath
   */
  getAudioFileStream(filePath: string): NodeJS.ReadableStream {
    if (this.audioStorage.getAudioFileStream) return this.audioStorage.getAudioFileStream(filePath);
    throw new Error(`Streaming not supported in current storage implementation`);
  }

  /**
   * GET /audio/new/list?after=ISO_DATE
   * 새로운 오디오 목록을 조회합니다.
   */
  getNewRecordings(after: string): AudioMetadata[] {
    return this.metadataStore.getRecordings(after);
  }
}
