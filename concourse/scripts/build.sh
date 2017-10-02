#!/usr/bin/env bash

set -e -u -x

cd twig && npm rebuild node-sass --force && npm run build:prod && mv dist ../twig-dist
