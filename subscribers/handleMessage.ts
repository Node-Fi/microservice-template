import { Request, Response } from 'express';
import { HandlerResolver } from '~subscribers/handlers';
import { Message } from '@google-cloud/pubsub';

export async function handleMessage(req: Request<Message>, res: Response) {
  if (!req.body) {
    const msg = 'no Pub/Sub message received';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  if (!req.body.message || !req.body.message.attributes) {
    const msg = 'invalid Pub/Sub message format';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }

  const message = req.body.message;
  const topic = message.attributes.topic;

  const handler = HandlerResolver.getInstance().resolveHandler(topic);

  if (!handler) {
    const msg = `no handler found for topic ${topic}`;
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  console.log('Calling handler.handle(message) with message: ', message);
  return handler.handle(message);
}
