set -e
$(aws ecr get-login --no-include-email --region ${AWS_DEFAULT_REGION})

echo "Updating service with force deployment to trigger update of repo image"
aws ecs update-service --service RPReactService-production --cluster RPReactCDKCluster-production --force-new-deployment