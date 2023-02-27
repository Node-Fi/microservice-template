import express, { Request } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

import helmet from 'helmet';
import { HandlerResolver } from './handlers';
import { Message } from '@google-cloud/pubsub';
config({ path: `.env.${process.env.NODE_ENV}` });

// The router for subscribers takes in POST requests to the root path
// These requests are pubsub messages from GCP
// It should intercept these in middleware, parse the topic name from the message body
// And reroute the request so that it goes to the url corresponding to the topic name

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet());

app.post('/', async (req: Request<Message>, res) => {
  if (!req.body) {
    const msg = 'no Pub/Sub message received';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  if (!req.body.message) {
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
  return handler.handle(message);
});
