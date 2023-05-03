import { Message, PubSub } from '@google-cloud/pubsub';
import { PubSubTopic } from '~subscribers/topics';

export class HandlerResolver {
  private handlers: Map<string, Handler<any>> = new Map();
  private static instance: HandlerResolver;

  private constructor() {
    if (HandlerResolver.instance) {
      throw new Error('Cannot instantiate HandlerResolver twice');
    }
  }

  public static clear() {
    this.instance = undefined;
  }

  public static getInstance(): HandlerResolver {
    if (!this.instance) {
      this.instance = new HandlerResolver();
    }
    return this.instance;
  }

  public registerHandler(handler: Handler<any>) {
    this.handlers.set(handler.topic, handler);
  }

  public resolveHandler<T>(topic: string): Handler<T> {
    return this.handlers.get(topic);
  }
}

export abstract class Handler<T, R = unknown> {
  constructor(public topic: string) {
    HandlerResolver.getInstance().registerHandler(this);
  }

  public abstract process(data: T, messageRaw: Message): Promise<R>;

  public async handle(event: Message) {
    const decodedData = Buffer.from(event.data.toString(), 'base64').toString();
    const data = JSON.parse(decodedData) as T;

    try {
      const result = await this.process(data, event);
      return result;
    } catch (e) {
      const pubsubClient = new PubSub({
        projectId: process.env.GCP_ID ?? 'node-wallet',
      });

      const topic = pubsubClient.topic(PubSubTopic.SubscriptionFailed);
      const message = {
        event: {
          topic: this.topic,
          data,
        },
        raw: event,
        error: e,
      };
      const buffer = Buffer.from(JSON.stringify(message));

      await topic.publishMessage({
        data: buffer,
      });

      throw e;
    }
  }
}
