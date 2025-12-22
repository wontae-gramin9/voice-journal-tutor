import { BadRequestException } from '@nestjs/common';

export const MIME_TO_EXTENSION = {
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/webm': '.webm',
  'audio/webm;codecs=opus': '.webm', // 브라우저 MediaRecorder가 사용하는 형식
  'audio/ogg': '.ogg',
  'audio/acc': '.acc',
};

export function getExtensionFromMime(mimeType: string): string {
  const extension = MIME_TO_EXTENSION[mimeType as keyof typeof MIME_TO_EXTENSION];
  if (!extension) throw new BadRequestException('Unsupported audio format');

  return extension;
}
