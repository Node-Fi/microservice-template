#!/bin/bash

# Create cloud build triggers

gcloud beta builds triggers create github \
    --name="portfolio-service" \
    --repo-owner="Node-Fi" --repo-name="portfolio-service" \
    --branch-pattern="^main$" \
    --description="Trigger for main branch" \
    --include-logs-with-status \
    --region="global" \
    --inline-config="./cloudbuild.yaml"
