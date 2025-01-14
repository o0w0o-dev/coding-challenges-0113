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
ECR_IMAGE="708425621425.dkr.ecr.us-east-1.amazonaws.com/o0w0o/image-search:latest"

cd /home/ec2-user/apps/$FOLDER_NAME

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

# check if sops is installed and available in the user's PATH # TODO
command -v sops

sops --decrypt --encryption-context Role:image-search-development-sops-role ./ansible/$ENV/secrets.enc.env > .env

# remove container if running
docker rm -f ${CONTAINER_NAME} || true

# docker pull image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 708425621425.dkr.ecr.us-east-1.amazonaws.com
docker build -t o0w0o/image-search .
docker tag o0w0o/image-search:latest $ECR_IMAGE
docker push $ECR_IMAGE
docker pull $ECR_IMAGE
docker run -d -p 4000:4000 $ECR_IMAGE