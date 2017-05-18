@Library('buildit')
import buildit.*

gitInst = new git()
slackInst = new slack()
envz = buildit.Jenkins.globalEnv
k8s = new K8S(this, Cloud.valueOf(envz.CLOUD), envz.REGION)

sendNotifications = false //FIXME !DEV_MODE
buildNumber = env.BUILD_NUMBER
appName = "twig2"
targetEnv = "staging"
slackChannel = "twig"
gitUrl = "https://github.com/buildit/twig.git"
dockerRegistry = envz.REGISTRY
image = "$dockerRegistry/$appName"

appUrl = "http://staging.twig.${envz.INT_DOMAIN}"

extraMounts = []
if (envz.HOST_PROJECT_PATH) {
  extraMounts << hostPathVolume(mountPath: '/var/projects', hostPath: envz.HOST_PROJECT_PATH)
}

k8s.build([containerTemplate(name: 'nodejs-builder', image: 'builditdigital/node-builder', ttyEnabled: true, command: 'cat',
  privileged: true, resourceRequestCpu: '0.5', resourceRequestMemory: '512m')],
  extraMounts) {


  try {
    container('nodejs-builder') {
      stage('Checkout') {
        checkout scm
        //git(url: '/var/projects/twig', branch: 'master')

        shortCommitHash = gitInst.getShortCommit()
        commitMessage = gitInst.getCommitMessage()
        npmInst = new npm()
        version = npmInst.getVersion()
      }

      stage("Install") {
        k8s.withCache('node_modules') {
          sh "npm install"
        }
      }

      //  stage("Test") {
      //    try {
      //      //nasty workaround for temporary chrome socket issue (can't use remote mount for it)
      //      sh "mkdir /tmp/wscopy && cd . && ls -1 | xargs -I '{}'  ln -s `pwd`/{} /tmp/wscopy/{}"
      //      sh "cd /tmp/wscopy && CHROME_BIN=/usr/bin/chromium xvfb-run -s '-screen 0 1280x1024x16' npm run test:ci"
      //    }
      //    finally {
      //      junit 'reports/test-results.xml'
      //    }
      //  }

      stage("Analysis") {
        sh "npm run lint"
      }

      stage("Build") {
        sh "npm run build:prod"
      }
    }

    stage('Docker Image Build') {
      tag = "${version}-${shortCommitHash}-${buildNumber}"
      k8s.dockerBuild(image, tag)
    }

    stage('Docker Push') {
      k8s.dockerPush(image, tag)
    }

    stage('Deploy To K8S') {
      k8s.helmDeploy(appName, targetEnv, image, tag)
    }

    stage('Run Functional Acceptance Tests') {
      container('nodejs-builder') {

        //nasty workaround for temporary chrome socket issue (can't use remote mount for it)
        sh "mkdir /tmp/wscopy && cd . && ls -1 | xargs -I '{}'  ln -s `pwd`/{} /tmp/wscopy/{}"

        try {
          // nasty workaround for local env (in case you haven't installed dnsmasq)
          sh "echo '192.168.99.100 twig2.stage.kube.local twig2.stage.kube.local heimdall.stage.kube.local' > /etc/hosts"
          sh "cd /tmp/wscopy && URL=${appUrl} xvfb-run -s '-screen 0 1280x1024x16' npm run test:e2e"
        }
        finally {
          archiveArtifacts allowEmptyArchive: true, artifacts: 'screenshots/*.png'
          junit 'reports/acceptance-test-results.xml'
        }
      }
    }

    stage('Promote Build to latest') {
      k8s.inDocker {
        sh "docker tag $image:$tag $image:latest"
      }
      k8s.dockerPush(image, 'latest')
      if (sendNotifications) slackInst.notify("Deployed to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> has been deployed to ${targetEnv}\n\n${commitMessage}", "good", "http://i3.kym-cdn.com/entries/icons/square/000/002/230/42.png", slackChannel)
    }

  }
  catch (err) {
    currentBuild.result = "FAILURE"
    if (sendNotifications) slackInst.notify("Error while deploying to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> failed to deploy to ${targetEnv}", "danger", "http://i2.kym-cdn.com/entries/icons/original/000/002/325/Evil.jpg", slackChannel)
    throw err
  }
}
