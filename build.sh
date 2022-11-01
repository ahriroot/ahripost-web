#!/bin/sh

# $1 is not empty
if [ -n "$1" ]; then
    echo "Image name:version => $1"

    echo "Building frontend..."
    yarn build

    echo "Building docker image..."
    docker build -t $1 .
else
    echo "Image name:version is empty"
fi
