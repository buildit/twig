@Library('buildit')
def LOADED = true
podTemplate(label: 'nodeapp',
  containers: [
    containerTemplate(name: 'nodejs-builder', image: 'builditdigital/node-builder', ttyEnabled: true, command: 'cat', privileged: true),
    containerTemplate(name: 'docker', image: 'docker:1.11', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'kubectl', image: 'builditdigital/kube-utils', ttyEnabled: true, command: 'cat')],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
    hostPathVolume(mountPath: '/var/cache', hostPath: '/tmp'),
    hostPathVolume(mountPath: '/var/projects', hostPath: '/Users/romansafronov/dev/projects')
  ]) {
  node('nodeapp') {

    currentBuild.result = "SUCCESS"
    sendNotifications = false //FIXME !DEV_MODE

    try {
      stage('Set Up') {
        gitInst = new git()
        npmInst = new npm()
        slackInst = new slack()

        appName = "twig"
        slackChannel = "twig"
        gitUrl = "https://github.com/buildit/twig2.git"
        appUrl = "http://twig2.kube.local"
        dockerRepo = "builditdigital"
        image = "$dockerRepo/$appName"
        deployment = "twig2-staging"
      }
      container('nodejs-builder') {
        stage('Checkout') {
          checkout scm
          //git(url: '/var/projects/twig2', branch: 'k8s')
          //'https://github.com/buildit/twig2.git') // fixme: checkout scm

          shortCommitHash = gitInst.getShortCommit()
          commitMessage = gitInst.getCommitMessage()
          version = npmInst.getVersion()
        }

        stage("Install") {
          // poor man's caching for node modules
          sh 'mkdir -p /var/cache/twig2-build/_cache'
          sh 'cp -r /var/cache/twig2-build/* .'
          sh "npm install"
          sh "rm -rf /var/cache/twig2-build/* && cp -r node_modules /var/cache/twig2-build/"
        }

        stage("Test") {
          try {
            sh "npm run test:ci"
          }
          finally {
            junit 'reports/test-results.xml'
          }
        }

        stage("Analysis") {
          sh "npm run lint"
        }

        stage("Build") {
          sh "npm run build:prod"
        }
      }
      container('docker') {
        stage('Docker Image Build') {
          tag = "${version}-${shortCommitHash}-${env.BUILD_NUMBER}"
          // Docker pipeline plugin does not work with kubernetes (see https://issues.jenkins-ci.org/browse/JENKINS-39664)
          sh "docker build -t $image:$tag ."
          //ecrInst.authenticate(env.AWS_REGION) FIXME
        }
      }
      //FIXME
      /*stage('Docker Push') {
        docker.withRegistry(registry) {
            image.push("${tag}")
        }
      }*/

      container('kubectl') {
        stage('Deploy To K8S') {
          // fixme: need to create deployment if it does not exist
          sh "cd k8s && helm upgrade $deployment ./twig2 -f vars_local.yaml --set image.tag=$tag"
          sh "kubectl rollout status deployment/$deployment-twig2"
        }
      }

      container('nodejs-builder') {
        stage('Run Functional Acceptance Tests') {
          //nasty workaround for temporary chrome socket issue (can't use remote mount for it)
          sh "mkdir /tmp/wscopy && cd . && ls -1 | xargs -I '{}'  ln -s `pwd`/{} /tmp/wscopy/{}"

          try {
            // nasty workaround for local env
            sh "echo '192.168.99.100 eolas.kube.local' > /etc/hosts"
            sh "cd /tmp/wscopy && URL=http://$deployment-twig2 xvfb-run -s '-screen 0 1280x1024x16' npm run test:e2e"
          }
          finally {
            archiveArtifacts allowEmptyArchive: true, artifacts: 'screenshots/*.png'
            junit 'reports/acceptance-test-results.xml'
          }
        }
      }

      container('docker') {
        stage('Promote Build to latest') {
          // fixme
          /*docker.withRegistry(registry) {
          image.push("latest")
      }*/
          sh "docker tag $image:$tag $image:latest"
          if (sendNotifications) slackInst.notify("Deployed to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> has been deployed to <${appUrl}|${appUrl}>\n\n${commitMessage}", "good", "http://i3.kym-cdn.com/entries/icons/square/000/002/230/42.png", slackChannel)
        }
      }
    }
    catch (err) {
      currentBuild.result = "FAILURE"
      if (sendNotifications) slackInst.notify("Error while deploying to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> failed to deploy to <${appUrl}|${appUrl}>", "danger", "http://i2.kym-cdn.com/entries/icons/original/000/002/325/Evil.jpg", slackChannel)
      throw err
    }
  }
}
