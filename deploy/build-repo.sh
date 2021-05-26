set -e
$(aws ecr get-login --no-include-email --region ${AWS_DEFAULT_REGION})
export IMAGE_NAME="rockpeaks-react:${BITBUCKET_BRANCH}"

# Overwrite env variables depends on branch.
if [[ "$BITBUCKET_BRANCH" != "production" ]]
then
  if [ -z $GRAPHQL_URI_DEVELOPMENT+x ]
  then
    echo "no dev graphql uri provided"
  else
    export GRAPHQL_URI=$GRAPHQL_URI_DEVELOPMENT
  fi
  if [ -z $GA_TRACKING_ID_DEVELOPMENT+x ]
  then
    echo "no dev ga tracking id provided"
  else
    export GA_TRACKING_ID=$GA_TRACKING_ID_DEVELOPMENT
  fi
fi

echo "Creating an env file to be used by build"
rm -f .env
touch .env
echo "GRAPHQL_URI=$GRAPHQL_URI" >> .env
echo "GRAPHQL_TOKEN=$GRAPHQL_TOKEN" >> .env
echo "GA_TRACKING_ID=$GA_TRACKING_ID" >> .env
echo "" >> .env

echo "Test contents of .env file"
cat .env

#export REGISTRY_FULL_NAME="${AWS_REGISTRY_URL}:${BITBUCKET_BRANCH}-${BITBUCKET_BUILD_NUMBER}"
echo "1) Building image \"${IMAGE_NAME}\" to registry: \"${REGISTRY_FULL_NAME}\""
docker build -t ${IMAGE_NAME} --build-arg commit="${BITBUCKET_BRANCH}-${BITBUCKET_BUILD_NUMBER}-${BITBUCKET_COMMIT}" -f deploy.${BITBUCKET_BRANCH}.Dockerfile .
echo "2) Tagging \"${IMAGE_NAME}\" to registry: \"${REGISTRY_FULL_NAME}\""
docker tag ${IMAGE_NAME} ${REGISTRY_FULL_NAME}
echo "3) Pushing to registry: \"${REGISTRY_FULL_NAME}\""
docker push ${REGISTRY_FULL_NAME}
echo "4) Tagging \"${IMAGE_NAME}\" to registry: \"${AWS_REGISTRY_URL}\":\"${BITBUCKET_BRANCH}\""
docker tag ${IMAGE_NAME} ${AWS_REGISTRY_URL}:${BITBUCKET_BRANCH}
echo "5) Pushing to registry: \"${AWS_REGISTRY_URL}\":\"${BITBUCKET_BRANCH}\""
docker push ${AWS_REGISTRY_URL}:${BITBUCKET_BRANCH}
echo "Completed pushing to registry"