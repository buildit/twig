#!/bin/sh

source /docker-lib.sh && start_docker

docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml up -d
docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml run --rm test-runner bash -c "cd /twig && npm install && npm run test:e2e:ci -- --base-href http://web"

# Store the return-code from the test-suite and tear down:
rc=$?
docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml down
echo "exit code = $rc "
exit $rc
