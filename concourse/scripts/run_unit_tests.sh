#!/usr/bin/env bash

set -e -u -x

mv dependency-cache/node_modules twig
cd twig && npm rebuild node-sass --force && CHROME_BIN=/usr/bin/google-chrome xvfb-run -s '-screen 0 1280x1024x16' npm run test:ci
