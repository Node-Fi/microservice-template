#!/bin/bash

# Start the emulator
gcloud beta emulators bigtable start --host-port=localhost:8086

# Set the environment variables
$(gcloud beta emulators bigtable env-init)