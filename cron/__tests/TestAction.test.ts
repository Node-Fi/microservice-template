import { TestAction } from '~cron/Actions/TestAction';

describe('TestAction', () => {
  it('should return value', async () => {
    const action = new TestAction();
    const result = await action.run();
    expect(result).toEqual('test');
  });
});
