import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IAudioStorage } from '@modules/audio/interfaces/audio-storage.interface';
import { generateFileName, getExtensionFromMime } from '@utils/audio.util';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AzureBlobStorageService implements IAudioStorage {
  private readonly logger = new Logger(AzureBlobStorageService.name);
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;
  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING');
    const containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER');

    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString!);
    this.containerClient = this.blobServiceClient.getContainerClient(containerName!);
  }

  async uploadAudio(uuid: string, fileData: Buffer, mimeType: string): Promise<string> {
    const extension = getExtensionFromMime(mimeType);
    const fileName = generateFileName(uuid, extension);
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadData(fileData, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });
    this.logger.log(`Uploaded audio file to Azure Blob Storage: ${fileName}`);
    return fileName;
  }

  getPlaybackUrl(uuid: string): string {
    // Controller에서 이 uuid로 getAudioFileStream() 호출하도록 설계
    // 이제 클라우드 url로 변경
    // 방식 1: 보안을 위해 NestJS 서버를 거치는 프록시 경로 (추천)
    return `/audio/play/${uuid}`;
  }

  async getAudioFileStream(fileName: string, start: number, fileSize: number): Promise<NodeJS.ReadWriteStream> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    const exists = await blockBlobClient.exists();
    if (!exists) {
      throw new NotFoundException(`Audio file not found in Azure Blob Storage: ${fileName}`);
    }
    const downloadResponse = await blockBlobClient.download(start, fileSize);
    return downloadResponse.readableStreamBody as NodeJS.ReadWriteStream;
  }
}
