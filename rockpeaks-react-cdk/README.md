# Rockpeaks CDK Subproject

This project defines the CloudFormation setup for the Rockpeaks React service.

Essentially, the script does the following:

For Each Environment (development & production)
Attach to the existing MusicPeaks VPC
Create a task definition that has two containers:

* Ngnix to reverse proxy requests to the Nextjs app
* Nextjs to run the nextjs app

Create a cluster (if it does not exist)
Create a service in that cluster (if it does not exist)
Attach the task definitition to the service
Create a target group from the service (if it does not exist)
Attach to the existing ALB & Listener (443)
Attach target group to listener

As there are 2 different stacks (development and production), you should use the `deploy-<ENVIRONMENT>.sh` and `destroy-<ENVIRONMENT>.sh` files to deploy or destroy the stacks.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
* `deploy-development.sh` deploy the development stack
* `destroy-development.sh` destroy the development stack
