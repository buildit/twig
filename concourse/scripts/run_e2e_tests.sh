#!/bin/sh

# Install docker-compose:
docker_install(){
    apk add --no-cache py-pip curl
    pip install docker-compose
}
‌‌
# Set up docker daemon with a config file:
docker_config(){
    mkdir /etc/docker
    touch /etc/docker/daemon.json
    echo '{"storage-driver":"btrfs","debug":true}' > 		/etc/docker/daemon.json
}
‌‌
# Start the docker daemon as a background task:
start_daemon(){
    dockerd --insecure-registry=${INSECURE_REG} --config-	file=/etc/docker/daemon.json -p /var/run/docker-bootstrap.pid &
}
‌‌
docker_install
docker_config
start_daemon

docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml up -d
docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml run --rm test-runner bash -c "cd twig && npm install && npm run test:ci"

# Store the return-code from the test-suite and tear down:
rc=$?
docker-compose -f ./twig-with-deps/concourse/compose/e2e.yml down
echo "exit code = $rc "
exit $rc
