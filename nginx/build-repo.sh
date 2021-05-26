##/usr/bin/env sh
set -e

set -o allexport
[[ -f .env ]] && source .env
set +o allexport

$(aws ecr get-login --no-include-email --region ${AWS_DEFAULT_REGION})
export IMAGE_NAME="rockpeaks-react-nginx:${BITBUCKET_BRANCH}"

#export REGISTRY_FULL_NAME="${AWS_REGISTRY_URL}:${BITBUCKET_BRANCH}-${BITBUCKET_BUILD_NUMBER}"
echo "1) Building image \"${IMAGE_NAME}\" to registry: \"${REGISTRY_FULL_NAME}\""
docker build -t ${IMAGE_NAME} -f ./Dockerfile .
echo "2) Tagging \"${IMAGE_NAME}\" to registry: \"${REGISTRY_FULL_NAME}\""
docker tag ${IMAGE_NAME} ${REGISTRY_FULL_NAME}
echo "3) Pushing to registry: \"${REGISTRY_FULL_NAME}\""
docker push ${REGISTRY_FULL_NAME}
