#!/bin/sh

SHA=`git rev-parse HEAD`
SHORT_SHA=`git rev-parse --short HEAD`
MESSAGE=`git show -s --format=%B $SHA`
COMMITTER=`git show -s --format=%ce $SHA`
GIT_REPO="https://github.com/buildit/twig/commit/"

cat <<EOL
{
  "sha": "$SHA",
  "short_sha": "$SHORT_SHA",
  "message": "$MESSAGE",
  "committer": "$COMMITTER",
  "url": "$GIT_REPO$SHA"
}
EOL

cat >./$1.json <<EOL
{
  "sha": "$SHA",
  "short_sha": "$SHORT_SHA",
  "message": "$MESSAGE",
  "committer": "$COMMITTER",
  "url": "$GIT_REPO$SHA"
}
EOL
