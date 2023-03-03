import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService {
  private _client: PubSub = new PubSub({
    projectId: process.env.GCP_ID ?? 'node-wallet',
  });

  emit(topic: string, data: any, orderingKey?: string) {
    const buffer = Buffer.from(JSON.stringify(data));
    return this._client
      .topic(
        topic,
        orderingKey
          ? {
              messageOrdering: true,
            }
          : undefined,
      )
      .publishMessage({
        data: buffer,
        orderingKey,
      });
  }
}
