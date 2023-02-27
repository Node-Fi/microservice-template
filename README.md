<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://storage.googleapis.com/node_protocol_images/nodefinance.png" width="200" alt="Node Finance Logo" /></a>
</p>


## Template Repository

A template to quickly bootstrap a repo for serverless microservices.  Separates logic between server, cron jobs, and workers.

- 🚀 Server uses [NestJs](http://nestjs.com/)
- ⏰ Cron jobs are powered by CLI parsing and GCP
- 👷‍♂️ Worker client is a lightweight express app to respond to messages posted to broker

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# integration tests
$ yarn test:integration

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
