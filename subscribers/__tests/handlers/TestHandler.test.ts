import { TestHandler } from '~subscribers/handlers/TestHandler';

describe('TestHandler', () => {
  it('should return value', async () => {
    const handler = new TestHandler();
    const result = await handler.process({ value: 'test' });
    expect(result).toEqual('test');
  });
});
