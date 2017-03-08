@Library('buildit')
def LOADED = true
podTemplate(label: 'nodeapp',
  containers: [
    containerTemplate(name: 'nodejs-builder', image: 'builditdigital/node-builder', ttyEnabled: true, command: 'cat', privileged: true),
    containerTemplate(name: 'aws', image: 'cgswong/aws', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'docker', image: 'docker:1.11', ttyEnabled: true, command: 'cat'),
    containerTemplate(name: 'kubectl', image: 'builditdigital/kube-utils', ttyEnabled: true, command: 'cat')],
  volumes: [
    hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock'),
    hostPathVolume(mountPath: '/var/cache', hostPath: '/tmp')
  ]) {
  node('nodeapp') {

    currentBuild.result = "SUCCESS"
    sendNotifications = false //FIXME !DEV_MODE

    try {
      stage('Set Up') {
        gitInst = new git()
        npmInst = new npm()
        slackInst = new slack()

        appName = "synapse"
        slackChannel = "synapse"
        gitUrl = "https://github.com/buildit/synapse.git"
        appUrl = "http://synapse.kube.local"
        mongoUrl = "mongodb://mongo-staging-mongodb:27017"
        dockerRegistry = "006393696278.dkr.ecr.us-east-1.amazonaws.com"
        image = "$dockerRegistry/$appName"
        deployment = "synapse-staging"
      }
      container('nodejs-builder') {
        stage('Checkout') {
          //checkout scm
          git(url: 'https://github.com/electroma/synapse.git', branch: 'k8s')

          shortCommitHash = gitInst.getShortCommit()
          commitMessage = gitInst.getCommitMessage()
          version = npmInst.getVersion()
        }

        stage("Install") {
          // poor man's caching for node modules
          sh 'mkdir -p /var/cache/synapse-build/_cache'
          sh 'cp -r /var/cache/synapse-build/* .'
          sh "npm install"
          sh "rm -rf /var/cache/synapse-build/* && cp -r node_modules /var/cache/synapse-build/"
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
          sh "NODE_ENV='removeme' npm run build"
        }
      }
      container('aws') {
        loginCmd = sh script: 'aws ecr get-login --region=us-east-1', returnStdout: true
      }

      container('docker') {
        stage('Docker Image Build') {
          tag = "${version}-${shortCommitHash}-${env.BUILD_NUMBER}"
          // Docker pipeline plugin does not work with kubernetes (see https://issues.jenkins-ci.org/browse/JENKINS-39664)
          sh "docker build -t $image:$tag ."
          stage('Docker Push') {
            sh loginCmd
            sh "docker push $image:$tag"
          }
        }
      }

      container('kubectl') {
        stage('Deploy To K8S') {
          // fixme: need to create deployment if it does not exist
          sh "cd k8s && helm upgrade $deployment ./synapse -f vars_ec2.yaml --set image.tag=$tag"
          sh "kubectl rollout status deployment/$deployment-synapse"
        }
      }

      container('nodejs-builder') {
        stage('Run Functional Acceptance Tests') {
          //nasty workaround for temporary chrome socket issue (can't use remote mount for it)
          sh "mkdir /tmp/wscopy && cd . && ls -1 | xargs -I '{}'  ln -s `pwd`/{} /tmp/wscopy/{}"

          try {
            sh "cd /tmp/wscopy && URL=http://$deployment-synapse xvfb-run -s '-screen 0 1280x1024x16' npm run test:acceptance:ci"
          }
          finally {
            archiveArtifacts allowEmptyArchive: true, artifacts: 'screenshots/*.png'
            junit 'reports/acceptance-test-results.xml'
          }
        }
      }

      container('docker') {
        stage('Promote Build to latest') {
          sh "docker tag $image:$tag $image:latest"
          sh "docker push $image:latest"
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
