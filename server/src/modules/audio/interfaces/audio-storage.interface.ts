export interface IAudioStorage {
  /**
   * @param uuid 고유 ID (파일 이름으로도 사용)
   * @param fileData 파일 버퍼 혹은 스트림
   * @param mimeType 파일의 MIME 타입
   * @returns 업로드된 파일의 URL
   */
  uploadAudio(uuid: string, fileData: Buffer, mimeType: string): Promise<string>;

  /**
   * @param uuid 고유 오디오 ID
   * @returns 재생 가능한 URL
   */
  getPlaybackUrl(uuid: string): string;

  getAudioFileStream?(fileName: string, start: number, chunkSize: number): Promise<NodeJS.ReadableStream>;
}

export interface IAudioMetadataStore {
  /**
   * @param metadata
   */
  saveMetadata(metadata: Record<string, any>): Promise<void>;

  /**
   * 현재 json 파일에서 동기적으로 메타데이터를 조회
   * @param uuid 고유 오디오 ID
   */
  getMetadata(uuid: string): Promise<AudioMetadata>;

  /**
   * 현재 json 파일에서 동기적으로 메타데이터를 조회
   * @param after 기준날짜 (ISO 문자열)
   */
  getMetadatas(after: string): Promise<AudioMetadata[]>;
}

export class AudioMetadata {
  uuid: string;
  title: string;
  mimeType: string;
  size: number; // in bytes
  duration: number; // in seconds
  fileName: string; // 상대경로로 변환한 이후에는 fileName만 필요
  extension: string;
  uploadedAt: Date;
}
