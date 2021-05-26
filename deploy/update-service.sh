set -e
$(aws ecr get-login --no-include-email --region ${AWS_DEFAULT_REGION})

echo "Updating service with force deployment to trigger update of repo image for \"${BITBUCKET_BRANCH}\""
aws ecs update-service --service RPReactService-${BITBUCKET_BRANCH} --cluster RPReactCDKCluster-${BITBUCKET_BRANCH} --force-new-deployment