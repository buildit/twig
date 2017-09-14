@Library('buildit') _
def region = 'us-east-1'
def owner = 'aochsner'
def environment = 'aochsner'
def project = 'twig'
def appName = 'twig-web'
def appUrl = "https://${environment}-twig.buildit.tools"
def gitUrl = "https://github.com/buildit/twig"
def registryBase = "006393696278.dkr.ecr.${region}.amazonaws.com"
def registry = "https://${registryBase}"
def ecrRepo = "${environment}-${appName}-ecr-repo"
def ecsService = "${owner}-${project}-${environment}-app-FrontendWebService-1OHHE0RTX9YA1-Service-1BJDYAN2LO3GY"
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
    lock("${appName}-build")
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
          image = docker.build("${ecrRepo}:${tag}", '.')
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

          // get deployment scripts
          sh "aws s3 cp s3://${owner}.${project}.${environment}.${region}.build/app-deployment ./scripts/ --recursive"
          sh "chmod +x ./scripts/*.sh"

          sh "./scripts/ecs-deploy.sh -c ${owner}-${project}-${environment}-ECSCluster -n ${ecsService} -i ${registryBase}/${ecrRepo}:${tag}"
        }
      }
    }
    stage('E2E Tests') {
      when { branch 'PR-39' }
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
      when { branch 'PR-39' }
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
