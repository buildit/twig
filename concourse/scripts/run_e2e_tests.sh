#!/bin/sh

docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml up -d
docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml run --rm test-runner bash -c "cd twig && npm install && npm run test:ci"

# Store the return-code from the test-suite and tear down:
rc=$?
docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml down
echo "exit code = $rc "
exit $rc
