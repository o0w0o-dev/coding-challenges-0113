#!/bin/bash

if [ $# -eq 0 ]; then
    echo "No env provided."
    echo "Usage: $0 <env>"
    exit 1
fi

ENV=$1
echo "ENV: $ENV"

FOLDER_NAME="image-search"
CONTAINER_NAME="image-search"

# cd /home/ec2-user/apps/$FOLDER_NAME

LOCAL_FOLDER_PATH=$(pwd)

BASE_NAME=$(basename "$LOCAL_FOLDER_PATH")

if [ "$BASE_NAME" == ${FOLDER_NAME} ]; then
    echo "The name of current working directory is '${FOLDER_NAME}'."
else
    echo "The name of current working directory is ${BASE_NAME} and not equal to '${FOLDER_NAME}'."
    exit 1
fi

export CONTAINER_NAME=$CONTAINER_NAME
export AWS_PROFILE=pantheonlab

sops --decrypt --encryption-context Role:image-search-development-sops-role ./ansible/$ENV/secrets.enc.env > .env

# remove container if running
docker rm -f ${CONTAINER_NAME} || true

# Run Docker Compose
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
else
    docker compose up -d --build
fi

# docker logs -f -t ${CONTAINER_NAME}