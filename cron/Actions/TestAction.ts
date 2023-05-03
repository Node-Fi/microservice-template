import { TaskName } from '~cron/config';
import { Action } from './Action';

export class TestAction extends Action<Record<string, unknown>, string> {
  constructor() {
    super(TaskName.TestAction);
  }

  public async run(): Promise<string> {
    return Promise.resolve('test');
  }
}
