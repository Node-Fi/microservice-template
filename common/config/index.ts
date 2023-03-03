import { config } from 'dotenv';

config({ path: `./.env.${process.env.NODE_ENV}` });

import app from './app';
import services from './services';
import settings from './settings';

export default [app, settings, services];
