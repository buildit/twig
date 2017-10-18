#!/bin/sh

# Get info
cd twig
SHA=`git rev-parse --short HEAD`
MESSAGE=`git show -s --format=%B $SHA`
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
        "value": "<git_commit_url/$SHA|$SHA>",
        "short": true
      },
      {
        "title": "Commit Message",
        "value": "$MESSAGE",
        "short": false
      }
    ],
    "text": "$MESSAGE"
  }
]
EOL

cat ./commit_info/attachments.json
