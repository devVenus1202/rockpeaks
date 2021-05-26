#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { RockpeaksReactCdkStack } from '../lib/rockpeaks-react-cdk-stack';

// @see https://docs.aws.amazon.com/cdk/latest/guide/stack_how_to_create_multiple_stacks.html
const app = new cdk.App();
new RockpeaksReactCdkStack(app, 'RockpeaksReactCdkStackDev', {
  env: {
    region: 'us-east-1',
    account: '016187473666',
  },
  rpConfig: {
    prefix: 'RPReact',
    environment: 'development',
    hostname: 'react-dev.rockpeaks.com',
    priority: 6,
  },
});
new RockpeaksReactCdkStack(app, 'RockpeaksReactCdkStackProd', {
  env: {
    region: 'us-east-1',
    account: '016187473666',
  },
  rpConfig: {
    prefix: 'RPReact',
    environment: 'production',
    hostname: 'react.rockpeaks.com',
    priority: 5,
  },
});