#!/usr/bin/env bash

set -e -u -x

# rev="$(git rev-parse HEAD | cut -c 1-7)"
# branch="$(git rev-parse --abbrev-ref HEAD)"
# docker_tag=$branch-$rev

echo $DOCKER_USERNAME

# echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin

# cd twig && docker build -t benaychh/twig:$docker_tag && docker images
