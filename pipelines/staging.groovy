@Library('buildit')
def LOADED = true

node {
  withEnv(["PATH+NODE=${tool name: '7.10.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {
    currentBuild.result = "SUCCESS"

    try {
      stage("Set Up") {

        sendNotifications = !env.DEV_MODE

        if (env.USE_GLOBAL_LIB) {
          ecrInst = new ecr()
          gitInst = new git()
          npmInst = new npm()
          slackInst = new slack()
          convoxInst = new convox()
          templateInst = new template()
        } else {
          sh "curl -L https://dl.bintray.com/buildit/maven/jenkins-pipeline-libraries-${env.PIPELINE_LIBS_VERSION}.zip -o lib.zip && echo 'A' | unzip lib.zip"
          ecrInst = load "lib/ecr.groovy"
          gitInst = load "lib/git.groovy"
          npmInst = load "lib/npm.groovy"
          slackInst = load "lib/slack.groovy"
          convoxInst = load "lib/convox.groovy"
          templateInst = load "lib/template.groovy"
        }

        domain = env.RIG_DOMAIN ? "riglet" : "buildit.tools"
        registryBase = "006393696278.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
        registry = "https://${registryBase}"
        appUrl = "http://staging.twig2.${domain}/"
        appName = "twig2"
        slackChannel = "twig"
        gitUrl = "https://github.com/buildit/twig"

      }

      stage("Checkout") {
        checkout scm
        // clean the workspace
        sh "git clean -ffdx"

        // global for exception handling
        shortCommitHash = gitInst.getShortCommit()
        commitMessage = gitInst.getCommitMessage()
        version = npmInst.getVersion()
      }

      stage("Install") {
        sh "npm install"
      }

      stage("Test") {
        try {
          sh "CHROME_BIN=/usr/bin/google-chrome xvfb-run -s '-screen 0 1280x1024x16' npm run test:ci"
        }
        finally {
          junit '**/reports/unit/*.xml'
        }
        publishHTML(target: [reportDir: 'coverage', reportFiles: 'index.html', reportName: 'Coverage Results'])
      }

      stage("Analysis") {
        sh "npm run lint"
        sh "/usr/local/bin/sonar-scanner -Dsonar.projectVersion=${version}"
      }

      stage("Build") {
        sh "npm run build:prod"
      }

      stage("Docker Image Build") {
        tag = "${version}-${shortCommitHash}-${env.BUILD_NUMBER}"
        image = docker.build("${appName}:${tag}", '.')
        ecrInst.authenticate(env.AWS_REGION)
      }

      stage("Docker Push") {
        docker.withRegistry(registry) {
          image.push("${tag}")
        }
      }

      stage("Deploy To AWS") {
        def tmpFile = UUID.randomUUID().toString() + ".tmp"
        def ymlData = templateInst.transform(readFile("docker-compose.yml.template"), [tag: tag, registryBase: registryBase])
        writeFile(file: tmpFile, text: ymlData)

        sh "convox login ${env.CONVOX_RACKNAME} --password ${env.CONVOX_PASSWORD}"
        sh "convox deploy --app ${appName}-staging --description '${tag}' --file ${tmpFile} --wait"
        // wait until the app is deployed
        convoxInst.waitUntilDeployed("${appName}-staging")
        convoxInst.ensureSecurityGroupSet("${appName}-staging", env.CONVOX_SECURITYGROUP)
      }

      stage("Run Functional Tests") {
        // run Selenium tests
        try {
          sh "npm run pree2e"
          sh "xvfb-run -s \"-screen 0 1440x900x24\" npm run test:e2e:ci -- --base-href ${appUrl}"
        }
        finally {
          archiveArtifacts allowEmptyArchive: true, artifacts: 'screenshots/*.png'
        }
      }

      stage("Promote Build to latest") {
        docker.withRegistry(registry) {
          image.push("latest")
        }
        if (sendNotifications) slackInst.notify("Deployed to Staging", "Commit '<${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}>' has been deployed to <${appUrl}|${appUrl}>\n\n${commitMessage}", "good", "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png", slackChannel)
      }
    }
    catch (err) {
      currentBuild.result = "FAILURE"
      if (sendNotifications) slackInst.notify("Error while deploying to Staging", "Commit '<${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}>' failed to deploy to <${appUrl}|${appUrl}>.", "danger", "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png", slackChannel)
      throw err
    }
  }
}
