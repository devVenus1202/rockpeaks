##/usr/bin/env sh
set -e

set -o allexport
[[ -f .env ]] && source .env
set +o allexport

npm run build
cdk deploy RockpeaksReactCdkStackDev