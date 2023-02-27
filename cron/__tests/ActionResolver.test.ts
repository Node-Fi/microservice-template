import { init } from '~cron/Actions';
import { ActionResolver } from '~cron/Actions/Action';
import { TestAction } from '~cron/Actions/TestAction';

describe('ActionResolver', () => {
  beforeEach(() => {
    ActionResolver.clear();
  });

  it('should return action', async () => {
    const action = new TestAction();
    const result = ActionResolver.getInstance().resolveAction('test-action');
    expect(result).toEqual(action);
  });

  it('should throw error', async () => {
    expect(() =>
      ActionResolver.getInstance().resolveAction('test-action-2'),
    ).toThrow();
  });

  it('Should register actions on init', () => {
    const expectedAction = 'test-action';
    init();
    const action = ActionResolver.getInstance().resolveAction(expectedAction);
    expect(action).toBeDefined();
    expect(action.name).toEqual(expectedAction);
  });
});
