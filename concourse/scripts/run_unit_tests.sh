#!/usr/bin/env bash

cd twig-with-deps && npm run test:ci

rc=$?

SHA=`git rev-parse --short HEAD`

cd ..

tar -zcf ./coverage/$SHA.tar.gz ./twig-with-deps/coverage

exit $rc
