import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './my-pipeline-app-stage';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';

export class MyPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);



    const source = CodePipelineSource.gitHub('dknoern/my-pipeline', 'main',{
      authentication: cdk.SecretValue.secretsManager('github-access-token'),
  });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new ShellStep('Synth', {
        input: source,
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const betaStage = pipeline.addStage(new MyPipelineAppStage(this, "beta", {stageName: "beta",
      env: { account: "284870623433", region: "us-west-2" }
    }));

    betaStage.addPost(new ManualApprovalStep('approval'));


    betaStage.addPost(new ShellStep('validate', {
      input: source,
      //commands: ['sh ../test/lamda-test.sh']
      commands: ['sh pwd','sh ls']
    }));

    pipeline.addStage(new MyPipelineAppStage(this, "gamma", {
      stageName: "gamma",
      env: { account: "284870623433", region: "us-east-1" }
    }));
  }
}