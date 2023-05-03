#!/bin/bash
# Handles creation of the cloud run services

### Main Server

gcloud run deploy portfolio-server \
    --image=gcr.io/node-wallet/portfolio-service/server:production \
    --allow-unauthenticated \
    --service-account=773721511353-compute@developer.gserviceaccount.com \
    --set-env-vars=DB_USER=postgres,DB_HOST=10.31.96.11,DB_PORT=5432,DB_NAME=holdings \
    --set-secrets=DB_PASS=ALLOY_DB_PASS_DEV:1 \
    --vpc-connector=projects/node-wallet/locations/us-central1/connectors/runapps-default-default \
    --cpu-boost \
    --region=us-central1 \
    --project=node-wallet \
    --async

gcloud run deploy portfolio-subscribers \
    --image=gcr.io/node-wallet/portfolio-service/subscribers:production \
    --allow-unauthenticated \
    --service-account=773721511353-compute@developer.gserviceaccount.com \
    --set-env-vars=DB_USER=postgres,DB_HOST=10.31.96.11,DB_PORT=5432,DB_NAME=holdings,COVALENT_API_KEY=ckey_dd1414b4f20f40efa58473dec0d \
    --set-secrets=DB_PASS=ALLOY_DB_PASS_DEV:1 \
    --vpc-connector=projects/node-wallet/locations/us-central1/connectors/runapps-default-default \
    --cpu-boost \
    --region=us-central1 \
    --project=node-wallet \
    --async
