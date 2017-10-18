#!/bin/sh

# Get info
cd twig

SHA=`git rev-parse HEAD`
SHORT_SHA=`git rev-parse --short HEAD`
MESSAGE=`git show -s --format=%B $SHA`
COMMITTER=`git show -s --format=%ce $SHA`
cd ..

# Create attachment
cat >./commit_info/attachments.json <<EOL
[
  {
    "title": "Build $status",
    "color": "$color",
    "fields": [
      {
        "title": "Deployment",
        "value": "$deployment_area",
        "short": true
      },
      {
        "title": "Branch",
        "value": "$branch",
        "short": true
      },
      {
        "title": "Commit",
        "value": "<$git_commit_url$SHA|$SHORT_SHA>",
        "short": true
      },
      {
        "title": "Committer",
        "value": "$COMMITTER",
        "short": true
      },
      {
        "title": "Commit Message",
        "value": "$MESSAGE",
        "short": false
      }
    ]
  }
]
EOL

cat ./commit_info/attachments.json
