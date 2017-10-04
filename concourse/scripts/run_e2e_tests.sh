#!/bin/sh

# Install docker-compose:
docker_install(){
    apk add --no-cache py-pip curl
    pip install docker-compose
}
‌‌
‌‌
docker_install

docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml up -d
docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml run --rm test-runner bash -c "cd twig && npm install && npm run test:ci"

# Store the return-code from the test-suite and tear down:
rc=$?
docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml down
echo "exit code = $rc "
exit $rc
