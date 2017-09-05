@Library('buildit') _
def appName = 'twig2'
def registryBase = "006393696278.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
def tag = 'latest'
def gitUrl = "https://github.com/buildit/twig"
def appUrl = "https://twig.buildit.tools"
def slackChannel = "twig"

pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
    skipStagesAfterUnstable()
  }
  stages {
    stage("Deploy to production") {
      steps {
        script {
          def templateInst = new template()
          def convoxInst = new convox()
          def tmpFile = UUID.randomUUID().toString() + ".tmp"
          def ymlData = templateInst.transform(readFile("docker-compose.yml.template")
            , [tag: tag, registryBase: registryBase])

          writeFile(file: tmpFile, text: ymlData)

          convoxInst.login("${env.CONVOX_RACKNAME}")
          convoxInst.ensureApplicationCreated("${appName}")
          sh "convox deploy --app ${appName} --description '${tag}' --file ${tmpFile} --wait"
          sh "rm ${tmpFile}"
          // wait until the app is deployed
          convoxInst.waitUntilDeployed("${appName}")
          convoxInst.ensureSecurityGroupSet("${appName}", "")
          convoxInst.ensureCertificateSet("${appName}", "nginx", 443, "acm-b53eb2937b23")
          convoxInst.ensureParameterSet("${appName}", "Internal", "No")
        }
      }
    }
  }
  post {
    success {
      slackNotify(
        "Deployed to Production",
        "(<${env.BUILD_URL}|Job>) Tagged Docker Image '${tag}' has been deployed to <${appUrl}|${appUrl}>",
        "good",
        "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png",
        slackChannel
      )
    }
    failure {
      slackNotify(
        "Failed to deploy to Production",
        "(<${env.BUILD_URL}|Failed Job>)",
        "danger",
        "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png",
        slackChannel
      )
    }
    unstable {
      slackNotify(
        "Failed to deploy to Production",
        "(<${env.BUILD_URL}|Failed Job>)",
        "danger",
        "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png",
        slackChannel
      )
    }
  }
}
