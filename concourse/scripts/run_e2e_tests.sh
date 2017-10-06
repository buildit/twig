#!/bin/sh

source /docker-lib.sh && start_docker

ls -la ng-cli-e2e

docker load -i ng-cli-e2e/image
docker tag "$(cat ng-cli-e2e/image-id)" "$(cat ng-cli-e2e/repository):$(cat ng-cli-e2e/tag)"

docker load -i couchdb/image
docker tag "$(cat couchdb/image-id)" "$(cat couchdb/repository):$(cat couchdb/tag)"

docker load -i twig-api/image
docker tag "$(cat twig-api/image-id)" "$(cat twig-api/repository):$(cat twig-api/tag)"

docker load -i twig-docker-image/image
docker tag "$(cat twig-docker-image/image-id)" "$(cat twig-docker-image/repository):$(cat twig-docker-image/tag)"

docker-compose -f ./twig/concourse/compose/e2e.yml up -d
docker-compose -f ./twig/concourse/compose/e2e.yml run --rm test-runner bash -c "cd /twig && npm install && npm run test:e2e:ci -- --base-href http://e2e-web"

# Store the return-code from the test-suite and tear down:
rc=$?
docker-compose -f ./twig/concourse/compose/e2e.yml down
echo "exit code = $rc "
exit $rc
