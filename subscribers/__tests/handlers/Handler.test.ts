import { Message } from '@google-cloud/pubsub';
import { HandlerResolver } from '~subscribers/handlers';
import { initHandlers } from '~subscribers/handlers/loadHandlers';
import { TestHandler } from '~subscribers/handlers/TestHandler';

describe('Handler', () => {
  beforeEach(() => {
    HandlerResolver.clear();
  });
  it('should register handler', () => {
    const handlerExpected = new TestHandler();

    const handler = HandlerResolver.getInstance().resolveHandler(
      handlerExpected.topic,
    );

    expect(handler).toEqual(handlerExpected);
  });

  it('Should register handlers on init', () => {
    const expectedTopic = 'test-topic';

    initHandlers();
    const handler = HandlerResolver.getInstance().resolveHandler(expectedTopic);

    expect(handler).toBeDefined();
    expect(handler.topic).toEqual(expectedTopic);
  });

  it('Should return undefined for unsupported topic', () => {
    const expectedTopic = 'test-topic-000';

    initHandlers();
    const handler = HandlerResolver.getInstance().resolveHandler(expectedTopic);

    expect(handler).toBeUndefined();
  });

  it('Should handle base-64 encoded message', async () => {
    const expectedTopic = 'test-topic';
    const expectedValue = 'test';

    initHandlers();
    const handler = HandlerResolver.getInstance().resolveHandler(expectedTopic);

    const result = await handler.handle({
      data: Buffer.from(JSON.stringify({ value: expectedValue })),
    } as Message);

    expect(result).toEqual(expectedValue);
  });
});
