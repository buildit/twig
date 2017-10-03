#!/usr/bin/env bash

set -e -u -x

cd twig

rev="$(git rev-parse HEAD | cut -c 1-7)"
docker_tag=$rev

set +x
echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin
set -x


# docker build -t benaychh/twig:$docker_tag && docker images
