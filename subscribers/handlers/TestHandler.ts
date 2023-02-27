import { Handler } from './Handler';

interface TestMessage {
  value: string;
}

export class TestHandler extends Handler<TestMessage, string> {
  constructor() {
    super('test-topic');
  }

  public async process(data: TestMessage): Promise<string> {
    return Promise.resolve(data.value);
  }
}
