#!/usr/bin/env bash

set -e -u -x

mv dependency-cache/node_modules twig
cd twig && npm run test:ci
