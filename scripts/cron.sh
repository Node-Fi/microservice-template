#!/bin/bash

# Assign command-line arguments to variables
task_name=$1
schedule=$2

# Check if both arguments are provided
if [ -z "$task_name" ] || [ -z "$schedule" ]; then
  echo "Usage: $0 <task_name> <schedule>"
  exit 1
fi

if gcloud run jobs describe ${task_name} --region=us-central1 --project=node-wallet > /dev/null 2>&1; then
  echo "Job already exists"
else
  gcloud run jobs create ${task_name} \
      --image=gcr.io/node-wallet/portfolio-service/cron:production \
      --args="${task_name}" \
      --service-account=773721511353-compute@developer.gserviceaccount.com \
      --set-env-vars=DB_USER=postgres,DB_HOST=10.31.96.11,DB_PORT=5432,DB_NAME=holdings \
      --set-secrets=DB_PASS=ALLOY_DB_PASS_DEV:1 \
      --vpc-connector=projects/node-wallet/locations/us-central1/connectors/runapps-default-default \
      --region=us-central1 \
      --project=node-wallet \
      --async
fi

# Check if a scheduler job with the given name already exists
if gcloud scheduler jobs describe ${task_name} > /dev/null 2>&1; then
  # Update the existing scheduler job
  echo "Updating existing scheduler job"
  gcloud scheduler jobs update http ${task_name} \
    --schedule="${schedule}" \
    --uri="https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/node-wallet/jobs/${task_name}:run" \
    --http-method POST \
    --oauth-service-account-email 773721511353-compute@developer.gserviceaccount.com
else
  # Create a new scheduler job
  echo "Creating new scheduler job"
  gcloud scheduler jobs create http ${task_name} \
    --schedule="${schedule}" \
    --uri="https://us-central1-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/node-wallet/jobs/${task_name}:run" \
    --http-method POST \
    --oauth-service-account-email 773721511353-compute@developer.gserviceaccount.com
fi
