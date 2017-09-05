pipelineJob('twig-production') {
  definition {
    cpsScm {
      scm {
          git {
            remote {
                github('buildit/twigpi')
                credentials('github-jenkins-buildit')
            }
            branch('master')
        }
      }
      scriptPath('pipelines/production.groovy')
    }
  }
}
