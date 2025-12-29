import { BadRequestException } from '@nestjs/common';
import { getSafeIsoTimestamp } from './time.util';

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

export function generateFileName(uuid: string, extension: string): string {
  return `${uuid}_${getSafeIsoTimestamp(new Date())}${extension}`;
}
