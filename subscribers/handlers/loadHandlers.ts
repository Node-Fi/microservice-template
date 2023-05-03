import { NewWalletHandler } from '~subscribers/new-wallet/handler';
import { Application } from 'express';
import { HandlerNewTenant } from '~subscribers/new-tenant/handler';

export const handlers = [NewWalletHandler, HandlerNewTenant];

export const initHandlers = (express?: Application) => {
  handlers.forEach((_handler) => {
    const handler = new _handler();
    if (!express) return;
    express.post(`/${handler.topic}`, (req, res) => {
      handler.handle(req.body.message).then((result) => {
        res.status(200).send(result);
      });
    });
  });
};
