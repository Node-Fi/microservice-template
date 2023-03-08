import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { config } from 'dotenv';

import helmet from 'helmet';
import { handleMessage } from './handleMessage';
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
app.post('/', handleMessage);

export default app;
