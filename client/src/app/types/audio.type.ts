export interface AudioMetadata {
  uuid: string;
  title: string;
  mimeType: string;
  size: number; // in bytes
  duration: number; // in seconds
  fileName: string; // 저장소 내의 경로/키 (IAudioStorage.uploadAudio의 반환값)
  extension: string;
  uploadedAt: Date;
}

export interface AudioInfo {
  metadata: AudioMetadata;
  playbackUrl: string;
}
