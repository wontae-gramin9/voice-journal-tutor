import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AudioMetadata, IAudioMetadataStore } from '@modules/audio/interfaces/audio-storage.interface';
import { Container, CosmosClient } from '@azure/cosmos';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureCosmosMetadataStoreService implements IAudioMetadataStore {
  private readonly logger = new Logger(AzureCosmosMetadataStoreService.name);
  private cosmosClient: CosmosClient;
  private metadataContainer: Container;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>('AZURE_COSMOS_CONNECTION_STRING');
    const dbName = this.configService.get<string>('AZURE_COSMOS_DB');
    const containerName = this.configService.get<string>('AZURE_COSMOS_CONTAINER');
    this.cosmosClient = new CosmosClient(connectionString!);
    this.metadataContainer = this.cosmosClient.database(dbName!).container(containerName!);
  }

  async saveMetadata(metadata: AudioMetadata): Promise<void> {
    const changeUUIDtoID = { ...metadata, id: metadata.uuid };
    await this.metadataContainer.items.create(changeUUIDtoID);
  }

  async getMetadata(uuid: string): Promise<AudioMetadata> {
    const { resource } = await this.metadataContainer.item(uuid, uuid).read<AudioMetadata>();
    if (!resource) {
      throw new NotFoundException(`Metadata not found for UUID: ${uuid}`);
    }
    return resource;
  }

  async getMetadatas(after: string): Promise<AudioMetadata[]> {
    const afterDate = new Date(after);
    if (isNaN(afterDate.getTime())) {
      throw new Error('Invalid ISO date format for "after" parameter.');
    }

    const querySpec = {
      query: 'SELECT * FROM c WHERE c.uploadedAt > @after ORDER BY c.uploadedAt DESC',
      parameters: [
        {
          name: '@after',
          value: after,
        },
      ],
    };

    const { resources } = await this.metadataContainer.items.query<AudioMetadata>(querySpec).fetchAll();
    return resources;
  }
}
