import { TestAction } from './Actions/TestAction';
import { UpdatePortfolioAction } from './portfolio/UpdatePortfolioAction';
import { UpdatePriceAction } from './prices/UpdatePricesAction';

export const actions = [TestAction, UpdatePriceAction, UpdatePortfolioAction];

export const initializeActions = () => {
  actions.forEach((action) => new action());
};
