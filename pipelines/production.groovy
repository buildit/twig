@Library('buildit')
def LOADED = true

// Production release pipeline
node {

  currentBuild.result = "SUCCESS"

  try {

    stage("Set Up") {
      sendNotifications = !env.DEV_MODE
      ad_ip_address = sh(script: "dig +short corp.${env.RIG_DOMAIN} | head -1", returnStdout: true).trim()

      checkout scm
      // clean the workspace before checking out
      sh "git clean -ffdx"

      if (env.USE_GLOBAL_LIB) {
        uiInst = new ui()
        ecrInst = new ecr()
        slackInst = new slack()
        templateInst = new template()
        convoxInst = new convox()
      } else {
        sh "curl -L https://dl.bintray.com/buildit/maven/jenkins-pipeline-libraries-${env.PIPELINE_LIBS_VERSION}.zip -o lib.zip && echo 'A' | unzip -o lib.zip"
        uiInst = load "lib/ui.groovy"
        ecrInst = load "lib/ecr.groovy"
        slackInst = load "lib/slack.groovy"
        templateInst = load "lib/template.groovy"
        convoxInst = load "lib/convox.groovy"
      }


      registryBase = "006393696278.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
      registry = "https://${registryBase}"
      appUrl = "https://twig.buildit.tools/"
      appName = "twig2"
      slackChannel = "twig"
      gitUrl = "https://github.com/buildit/twig"

      tmpFile = UUID.randomUUID().toString() + ".tmp"

      // select the tag
      // tag = uiInst.selectTag(ecrInst.imageTags(appName, env.AWS_REGION))
      tag = "latest"
    }

    stage("Write docker-compose") {
      def ymlData = templateInst.transform(readFile("docker-compose.yml.template")
        , [tag: tag, registryBase: registryBase, ad_ip_address: ad_ip_address])

      writeFile(file: tmpFile, text: ymlData)
    }

    stage("Deploy to production") {
      sh "convox login ${env.CONVOX_RACKNAME} --password ${env.CONVOX_PASSWORD}"
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
  catch (err) {
    currentBuild.result = "FAILURE"
    throw err
  }
  finally {
    if (sendNotifications) {
      if (currentBuild.result == null || currentBuild.result == "SUCCESS") {
        slackInst.notify("Deployed to Production", "Tag '<${gitUrl}/commits/tag/${tag}|${tag}>' has been deployed to <${appUrl}|${appUrl}>", "good", "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png", slackChannel)
      } else {
        slackInst.notify("Error while deploying to Production", "Tag '<${gitUrl}/commits/tag/${tag}|${tag}>' failed to deploy to <${appUrl}|${appUrl}>", "danger", "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png", slackChannel)
      }
    }
  }
}
