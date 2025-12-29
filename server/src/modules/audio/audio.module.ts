import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { AUDIO_METADATA_STORE, AUDIO_STORAGE_SERVICE } from './audio.constants';
import { AzureBlobStorageService } from './services/azure-blob-storage.service';
import { AzureCosmosMetadataStoreService } from './services/azure-cosmos-metadata-store.service';

@Module({
  controllers: [AudioController],
  providers: [
    AudioService,
    { provide: AUDIO_STORAGE_SERVICE, useClass: AzureBlobStorageService },
    {
      provide: AUDIO_METADATA_STORE,
      useClass: AzureCosmosMetadataStoreService,
    },
  ],
})
export class AudioModule {}
