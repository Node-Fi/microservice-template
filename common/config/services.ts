import { registerAs } from '@nestjs/config';

export const IpApiUrlBase = 'https://ipapi.co';

// all third-party services' configurations to go here
export default registerAs('services', () => ({
  sentry: {
    dsn: process.env.SENTRY_DSN,
    debug: process.env.NODE_ENV === 'development',
    environment: process.env.NODE_ENV,
    release: null,
  },
}));
