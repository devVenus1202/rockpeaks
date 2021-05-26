##/usr/bin/env sh
set -e

set -o allexport
[[ -f .env ]] && source .env
set +o allexport

cdk destroy RockpeaksReactCdkStackProd