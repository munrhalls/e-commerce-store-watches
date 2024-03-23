#!/bin/bash

export IMAGE_TAG=$(git describe --tags --abbrev=0)
echo "Pushing image with tag: $IMAGE_TAG"

docker login
docker compose -f compose-local.yaml build --build-arg IMAGE_TAG=$IMAGE_TAG
docker compose -f compose-local.yaml push