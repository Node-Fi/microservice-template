import { Action } from './Action';

export class TestAction extends Action<Record<string, unknown>, string> {
  constructor() {
    super('test-action');
  }

  public async run(): Promise<string> {
    return Promise.resolve('test');
  }
}
