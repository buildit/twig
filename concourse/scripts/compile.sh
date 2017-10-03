#!/usr/bin/env bash

set -e -u -x

cd twig-with-deps && npm run build:prod && mv -fr ./ ../twig-with-dist/
