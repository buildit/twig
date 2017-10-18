#!/usr/bin/env bash

cd twig
SHA=`git rev-parse --short HEAD`
MESSAGE=`git show -s --format=%B $SHA`
cd ..
cat >./commit_info/text <<EOL
Commit: [<$git_commit_url$SHA|$SHA>]
Message: "$MESSAGE"
EOL

