const test = require('ava');
const cfntest = require('@cfn-modules/test');

test.serial('defaults', async t => {
  const stackName = cfntest.stackName();
  try {
    t.log(await cfntest.createStack(`${__dirname}/defaults.yml`, stackName, {}));
    // what could we test here?
  } finally {
    t.log(await cfntest.deleteStack(stackName));
    t.pass();
  }
});

test.serial('named', async t => {
  const stackName = cfntest.stackName();
  try {
    t.log(await cfntest.createStack(`${__dirname}/named.yml`, stackName, {}));
    // what could we test here?
  } finally {
    t.log(await cfntest.deleteStack(stackName));
    t.pass();
  }
});

test.serial('lambda-layer', async t => {
  const bucketStackName = cfntest.stackName();
  const stackName = cfntest.stackName();
  const contentKey = 'test.zip';
  const dummyFilePath = `${__dirname}/dummy.zip`;
  let bucketStackOutputs;

  try {
    t.log(await cfntest.createStack(`${__dirname}/node_modules/@cfn-modules/s3-bucket/module.yml`, bucketStackName, {Versioning: 'false'}));
    
    bucketStackOutputs = await cfntest.getStackOutputs(bucketStackName);

    await cfntest.createObject(bucketStackOutputs.Name, contentKey, dummyFilePath);
    
    t.log(await cfntest.createStack(`${__dirname}/layer.yml`, stackName, {
      ContentBucket: bucketStackOutputs.Name,
      ContentKey: contentKey
    }));
    // what could we test here?
  } finally {
    if (bucketStackOutputs) {
      t.log(await cfntest.deleteObject(bucketStackOutputs.Name, contentKey));
    }
    t.log(await cfntest.deleteStack(stackName));
    t.log(await cfntest.deleteStack(bucketStackName));
    t.pass();
  }
});
