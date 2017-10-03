#!/usr/bin/env bash

set -e -u -x

cd twig-with-deps && npm run build:prod && cd .. && copy twig-with-deps twig-with-dist
