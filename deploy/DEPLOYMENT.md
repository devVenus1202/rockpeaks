# RockPeaks React REPO DEPLOYMENT Documentation

## Testing

* edit `test-env.sh` to set values for env. `source test-env.sh`
* from the root directory run `deploy/build-repo.sh` which will create docker image and deploy to repo (with values based on current env)
* after deploying run `./update-service.sh` to point fargate service to new repo tag (the update service will use the current BITBUCKET_BRANCH to reload the appropriate service (either dev or prod))
