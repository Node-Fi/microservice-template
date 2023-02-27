export * from './Action';

import { TestAction } from './TestAction';

export const actions = [TestAction];

export const init = () => {
  actions.forEach((action) => new action());
};
