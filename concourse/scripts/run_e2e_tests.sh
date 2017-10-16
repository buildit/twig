#!/bin/sh

tar_screenshots()
{
  ls -la
}

source /docker-lib.sh && start_docker

docker load -i ng-cli-e2e/image
docker tag "$(cat ng-cli-e2e/image-id)" "$(cat ng-cli-e2e/repository):$(cat ng-cli-e2e/tag)"

docker load -i couchdb/image
docker tag "$(cat couchdb/image-id)" "$(cat couchdb/repository):$(cat couchdb/tag)"

docker load -i twig-api/image
docker tag "$(cat twig-api/image-id)" "$(cat twig-api/repository):$(cat twig-api/tag)"

docker-compose -f ./twig/concourse/compose/e2e.yml run --rm test-runner bash -c "cd /twig && npm install && npm run test:e2e:ci -- --base-href http://e2e-web"

# Store the return-code from the test-suite and tear down:
rc=$?

if ( $rc > 0 ); then
  tar_screenshots;
endif

echo "exit code = $rc "
exit $rc
