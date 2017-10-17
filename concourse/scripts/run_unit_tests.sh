#!/usr/bin/env bash

cd twig-with-deps && npm run test:ci

rc=$?

SHA=`git rev-parse HEAD | cut -c 1-7`

cd ..

tar -zcf ./coverage/$SHA.tar.gz ./twig/coverage

exit $rc
