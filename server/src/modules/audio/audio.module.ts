import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { AUDIO_METADATA_STORE, AUDIO_STORAGE_SERVICE } from './audio.constants';
import { LocalFileStorageService } from './services/local-file-storage.service';
import { LocalJsonMetadataStoreService } from './services/local-json-metadata-store.service';

@Module({
  controllers: [AudioController],
  providers: [
    AudioService,
    { provide: AUDIO_STORAGE_SERVICE, useClass: LocalFileStorageService },
    {
      provide: AUDIO_METADATA_STORE,
      useClass: LocalJsonMetadataStoreService,
    },
  ],
})
export class AudioModule {}
