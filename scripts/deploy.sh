#!/bin/bash

# Deploy the service from scratch

## Deploy main server
./server.sh 

## Deploy cron jobs
# yarn ts-node ./createCronJobs.ts

## Deploy subscribers
yarn deploy:subscribers