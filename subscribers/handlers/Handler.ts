import { Message } from '@google-cloud/pubsub';

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

  public handle(event: Message) {
    const decodedData = event.data.toString('utf-8');
    const data = JSON.parse(decodedData) as T;

    return this.process(data, event);
  }
}
