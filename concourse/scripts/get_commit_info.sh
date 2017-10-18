#!/usr/bin/env bash

# Create message
cd twig
SHA=`git rev-parse --short HEAD`
MESSAGE=`git show -s --format=%B $SHA`
cd ..
cat >./commit_info/text <<EOL
Commit: [<$git_commit_url$SHA|$SHA>]
Commit Message: "$MESSAGE"
EOL

# Create attachment
PIPELINE_URL="$concourse_ci_url/teams/$BUILD_TEAM_NAME/pipelines/$BUILD_PIPELINE_NAME/jobs/$BUILD_JOB_NAME/builds/$BUILD_NAME"
TEXT="*Status -* $status\n*Deployment -* $deployment_area*Branch:* $branchThe build failed at step [<$PIPELINE_URL|$BUILD_JOB_NAME>]"
if [ "$status" == "FAILED" ];
then
  COLOR="danger"
elif [ "$status" = "SUCCESS" ];
then
  COLOR="good"
else
  COLOR="#333333"
fi

cat >./commit_info/attachments <<EOL
[
  {
    "text": "$TEXT",
    "color": "$COLOR"
  }
]
