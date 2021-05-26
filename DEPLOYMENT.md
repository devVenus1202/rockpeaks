# RockPeaks React DEPLOYMENT Documentation

## Possible Errors

* If you see an auth error like "User: arn:aws:iam::016187473666:xxx is not authorized to perform: cloudformation:GetTemplate on resource: arn:aws:cloudformation:us-east-1:016187473666:stack/RockpeaksReactCdkStack " then make sure you have the correct environment set.  If you are using the test environment (for Pipeline testing) then you should switch shells.
* If you get an error with "is in UPDATE_IN_PROGRESS state and can not be updated." go to the CF admin panel on the AWS console.  Select the stack (by name) and pick the "Cancel update stack" fron the Stack Actions picker
* If the stack is stuck on "UPDATE_ROLLBACK_IN_PROGRESS" try going into the running service and killing the task that is trying to launch.

## Build Repos

### nginx

* Make any changes to the nginx Dockerfile and config files and then:
* `cd nginx && ./build-repo.sh`
* See readme in nginx directory for additional details

### nextjs

* Edit nextjs
* Set test env (if required) using `source deploy/test-env.sh`
* run deploy script `cd deploy && ./build-repo.sh`
* update service `cd deploy && ./update-service.sh`

## Remotely

### Push to bitbucket branch

#### 'develop'

* deploys to development container

#### 'staging'

* deploys to staging container

#### 'production'

* deploys to production container

## Locally

### Yarn commands

```bash
yarn docker:up
yarn docker:up-detach
yarn docker:stop
yarn docker:down
```

### Work in Docker environment for Development

```bash
docker-compose -d up --build
```

### View Docker logs (when detached)

```bash
docker-compose logs -f
```

### Stop Docker environment for Development

```bash
docker-compose stop
```

### Terminate Docker environment for Development

```bash
docker-compose down
```

### Container (just for testing deployments)

#### You can Build just the container

```bash
docker build -t musicpeaks/nextjs -n  .
```

#### You can show the built container

```bash
docker image ls
```

#### You can Run the container

```bash
docker run -p 3000:3000 rockpeaks-react:development
# docker run -p 3000:3000 musicpeaks/nextjs
```

#### You can run the container detached

```bash
docker run -d -p 3000:3000 rockpeaks-react:development
#docker run -d -p 3000:3000 musicpeaks/nextjs
```

#### You can list the running containers

```bash
docker container ls
# or show all containers
docker container ls -a
```

#### You can stop a running containers

```bash
# docker container ls
# first to get container id
docker container stop <CONTAINER ID>
```

## Pipelines Setup

### Environment Variables

* ECS_SERVICE_NAME: Name of the ECS Service to update.
* ECS_CLUSTER_NAME: Name of the ECS Cluster the service should run on.
* ECS_TASK_FAMILY_NAME: Family name for the Task Definition.
* AWS_SECRET_ACCESS_KEY: Secret key for a user with the required permissions.
* AWS_ACCESS_KEY_ID: Access key for a user with the required permissions.
* AWS_DEFAULT_REGION: Region where the target AWS Lambda function is.
* AWS_REGISTRY_URL: The registry URL for ECR
* GRAPHQL_TOKEN: for the container's ENV
* GRAPHQL_URI: for the container's ENV
* NODE_PORT: for the container's ENV
* TASK_CPU: The task's CPU value
* TASK_MEMORY: The task's Memory value
