#!/usr/bin/env bash

set -e -u -x

cd twig-with-dependencies && npm run build:prod && cd .. && mv twig-with-dependencies built-twig
