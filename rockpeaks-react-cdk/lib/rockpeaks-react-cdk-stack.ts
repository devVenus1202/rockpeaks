import cdk = require('@aws-cdk/core');
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import ecr = require("@aws-cdk/aws-ecr");
import logs = require('@aws-cdk/aws-logs');
import elb = require("@aws-cdk/aws-elasticloadbalancingv2");

interface ReactStackProps extends cdk.StackProps {
  rpConfig: {
    prefix: string,
    environment: string,
    hostname: string,
    priority: number,
  },
}

export class RockpeaksReactCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: ReactStackProps) {
    super(scope, id, props);
    /*
    Allowed VPC vpc-8aeed2f1
    Allowed subnets subnet-fbd713a7,subnet-e6ec2381
    Security groups* sg-09d245ebb62a98bf7
    */
    if (props?.rpConfig) {
      const { rpConfig } = props;
      this.createForPrefixedEnvironment(rpConfig.prefix, rpConfig.environment, rpConfig.hostname, rpConfig.priority);
    } else {
      console.error('no rpConfig');
    }
  }

  public createForPrefixedEnvironment(prefix: string, environment: string, hostname: string, priority: number) {
    const vpc = ec2.Vpc.fromLookup(this, 'MusicPeaksMainVPC', { vpcId: "vpc-8aeed2f1" });
    const cluster = new ecs.Cluster(this, `${prefix}CDKCluster-${environment}`, {
      vpc: vpc,
      clusterName: `${prefix}CDKCluster-${environment}`,
    });
    this.createForEnvironment(vpc, cluster, prefix, environment, hostname, priority);
  }

  private createForEnvironment(vpc: ec2.IVpc, cluster: ecs.ICluster, prefix: string, environment: string, hostname: string, priority: number) {

    console.log(`creating for ${environment}`);

    const taskDefinition = new ecs.FargateTaskDefinition(this, `${prefix}TaskDef-${environment}`, {
      cpu: 1024,
      memoryLimitMiB: 2048,
    });

    const nginxRepo = ecr.Repository.fromRepositoryName(this, `${prefix}NginxRepo`, 'rockpeaks-react-nginx');
    const nginxRepoTag = 'development-630';
    const nginxImage = ecs.ContainerImage.fromEcrRepository(nginxRepo, nginxRepoTag);

    const nextjsRepo = ecr.Repository.fromRepositoryName(this, `${prefix}NextJsRepo`, 'rockpeaks-react');
    const nextjsRepoTag = environment;
    const nextjsImage = ecs.ContainerImage.fromEcrRepository(nextjsRepo, nextjsRepoTag);

    // create a task definition with CloudWatch Logs
    const logging = new ecs.AwsLogDriver({
      streamPrefix: `ecs/${prefix}/${environment}`,
      logRetention: logs.RetentionDays.ONE_MONTH,
    })
    const nginxContainer = taskDefinition.addContainer(`NginxReverseProxyContainer-${environment}`, {
      image: nginxImage,
      memoryLimitMiB: 512,
      cpu: 256,
      logging,
    });
    nginxContainer.addPortMappings({
      hostPort: 3000,
      containerPort: 3000,
      protocol: ecs.Protocol.TCP
    });

    const nextjsContainer = taskDefinition.addContainer(`NextJSContainer-${environment}`, { // NextJSContainer is the 'name' attribute - maybe for reference in dockerfile
      image: nextjsImage,
      memoryLimitMiB: 1024,
      cpu: 512,
      logging,
    });
    nextjsContainer.addPortMappings({
      hostPort: 3001,
      containerPort: 3001,
      protocol: ecs.Protocol.TCP
    });

    // only create if doesn't exist, otherwise update.
    const service = new ecs.FargateService(this, `${prefix}FargateService-${environment}`, {
      cluster: cluster,
      taskDefinition,
      serviceName: `${prefix}Service-${environment}`,
    });

    // const port80ListenerArn = 'arn:aws:elasticloadbalancing:us-east-1:016187473666:listener/app/ECS-service-loadbalancer/e54d0d23065c40fa/5d2b5a86047b60cb';
    const port443ListenerArn = 'arn:aws:elasticloadbalancing:us-east-1:016187473666:listener/app/ECS-service-loadbalancer/e54d0d23065c40fa/2614d160cc11220e';

    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, "ALBSecGroup", "sg-09d245ebb62a98bf7")

    // Listener from existing arn (see LB / listeners for arns)
    const existingListener = elb.ApplicationListener.fromApplicationListenerAttributes(this, "RPALBPort443Listener", {
      listenerArn: port443ListenerArn,
      securityGroup,
    });


    // Add new TargetGroup for the fargate service.  Only update if doesn't exist
    const targetGroup = new elb.ApplicationTargetGroup(this, `${prefix}ServiceTG-${environment}`, {
      vpc: vpc,
      port: 3000,
      protocol: elb.ApplicationProtocol.HTTP,
      targets: [service],
      targetGroupName: `${prefix}ServiceTG-${environment}`,
    });

    existingListener.addTargetGroups(`${prefix}TG-${environment}`, {
      hostHeader: hostname,
      priority,
      targetGroups: [targetGroup],
    });
  };
}
