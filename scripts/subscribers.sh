#!/bin/bash
# Handles creation of the cloud run services

# Assign command-line arguments to variables
topic=$1

# Check if both arguments are provided
if [ -z "$topic" ] ; then
  echo "Usage: $0 <topic>"
  exit 1
fi

### Check if the Pub/Sub topic already exists
if gcloud pubsub topics describe projects/node-wallet/topics/$topic > /dev/null 2>&1; then
  echo "Topic $topic already exists"
else
  gcloud pubsub topics create $topic
fi

### Subscribers

# Check if the Cloud Run service already exists
if gcloud run services describe portfolio-subscribers --region=us-central1 --project=node-wallet > /dev/null 2>&1; then
  echo "Service exists"
else
  echo "Subscriber service does not exist"
  exit 1
fi

# Check if the Eventarc trigger already exists
if gcloud eventarc triggers describe portfolio-subscribers-$topic --location=us-central1 --project=node-wallet > /dev/null 2>&1; then
  echo "Trigger already exists for topic $topic"
else
  gcloud eventarc triggers create portfolio-subscribers-$topic \
      --location=us-central1 \
      --service-account=773721511353-compute@developer.gserviceaccount.com \
      --transport-topic=projects/node-wallet/topics/$topic \
      --destination-run-service=portfolio-subscribers \
      --destination-run-region=us-central1 \
      --destination-run-path="/$topic" \
      --event-filters="type=google.cloud.pubsub.topic.v1.messagePublished"
fi
