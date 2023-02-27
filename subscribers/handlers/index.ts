export * from './Handler';

import { TestHandler } from './TestHandler';

export const handlers = [TestHandler];

export const init = () => {
  handlers.forEach((handler) => new handler());
};
