@Library('buildit') _
def region = 'us-east-1'
def appName = 'twig-web'
def environment = 'aochsner'
def appUrl = "https://${environment}-twig.buildit.tools"
def gitUrl = "https://github.com/buildit/twig"
def registryBase = "006393696278.dkr.ecr.${region}.amazonaws.com"
def registry = "https://${registryBase}"
def slackChannel = "twig"
def projectVersion
def tag
def ad_ip_address
def shortCommitHash
def commitMessage
def image

pipeline {
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '10'))
    disableConcurrentBuilds()
    skipStagesAfterUnstable()
    lock('twig-web-build')
  }
  tools {
    nodejs 'carbon'
  }
  triggers {
    pollSCM('* * * * *')
  }
  stages {
    stage('Bootstrap Additional Jobs') {
      when { branch 'master' }
      steps {
        jobDsl targets: 'jenkinsJobs.groovy',
               removedJobAction: 'DELETE'
      }
    }
    stage('Setup') {
      steps {
        script {
          def npmInst = new npm()
          projectVersion = npmInst.getVersion()

          def gitInst = new git()
          shortCommitHash = gitInst.getShortCommit()
          commitMessage = gitInst.getCommitMessage()
        }
      }
    }
    stage('Build')  {
      steps {
        sh "npm install"
      }
    }
    stage('Test') {
      steps {
        sh "npm run lint"
        // sh "npm run validate"
        sh "CHROME_BIN=/usr/bin/google-chrome xvfb-run -s '-screen 0 1280x1024x16' npm run test:ci"
      }
      post {
        always {
          junit 'reports/unit/TESTS.xml'
          publishHTML(target: [reportDir: 'coverage', reportFiles: 'index.html', reportName: 'Coverage Results'])
        }
      }
    }
    stage('Analysis') {
      when { branch 'master' }
      steps {
        sh "/usr/local/bin/sonar-scanner -Dsonar.projectVersion=${projectVersion}"
      }
    }
    stage('Package') {
      steps {
        sh "npm run build:prod"
        script {
          tag = "${projectVersion}-${env.BRANCH_NAME}-${env.BUILD_NUMBER}-${shortCommitHash}"
          image = docker.build("${environment}-${appName}-ecr-repo:${tag}", '.')
        }
      }
    }
    stage('Deploy') {
      when { branch 'PR-39' }
      steps {
        script {
          def convoxInst = new convox()
          def templateInst = new template()
          def ecrInst = new ecr()

          ecrInst.authenticate(region)
          docker.withRegistry(registry) {
            image.push()
          }

          def tmpFile = UUID.randomUUID().toString() + ".tmp"
          def ymlData = templateInst.transform(readFile("docker-compose.yml.template"),
            [tag: tag, registryBase: registryBase])
          writeFile(file: tmpFile, text: ymlData)

          // convoxInst.login("${env.CONVOX_RACKNAME}")
          // convoxInst.ensureApplicationCreated("${appName}-staging")
          // sh "convox deploy --app ${appName}-staging --description '${tag}' --file ${tmpFile} --wait"
          // // wait until the app is deployed
          // convoxInst.waitUntilDeployed("${appName}-staging")
          // convoxInst.ensureSecurityGroupSet("${appName}-staging", "")
          // convoxInst.ensureCertificateSet("${appName}-staging", "nginx", 443, "acm-b53eb2937b23")
          // convoxInst.ensureParameterSet("${appName}-staging", "Internal", "Yes")
        }
      }
    }
    stage('E2E Tests') {
      when { branch 'master' }
      steps {
          sh "xvfb-run -s \"-screen 0 1440x900x24\" npm run test:e2e:ci -- --base-href ${appUrl}"
      }
      post {
        always {
          junit 'reports/e2e/junitresults.xml'
          archiveArtifacts allowEmptyArchive: true, artifacts: 'screenshots/*.png'
        }
      }
    }
    stage("Promote Build to latest") {
      when { branch 'master' }
      steps {
        script {
          docker.withRegistry(registry) {
            image.push("latest")
          }
        }
      }
    }
  }
  post {
    success {
      slackNotify(
        "Build Succeeded - Staging - Branch: ${env.BRANCH_NAME}",
        "(<${env.BUILD_URL}|Job>) Commit '<${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}>' ${ env.BRANCH_NAME == 'master' ? 'deployed to <'+appUrl+'|'+appUrl+'>' : 'succeeded'}.\n\n${commitMessage}",
        "good",
        "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png",
        slackChannel
      )
    }
    failure {
      slackNotify(
        "Build Failed - Staging - Branch: ${env.BRANCH_NAME}",
        "(<${env.BUILD_URL}|Failed Job>) Commit '<${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}>' failed.\n\n${commitMessage}",
        "danger",
        "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png",
        slackChannel
      )
    }
    unstable {
      slackNotify(
        "Build Failed - Staging - Branch: ${env.BRANCH_NAME}",
        "(<${env.BUILD_URL}|Failed Job>) Commit '<${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}>' failed.\n\n${commitMessage}",
        "danger",
        "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png",
        slackChannel
      )
    }
  }
}
