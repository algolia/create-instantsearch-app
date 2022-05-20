module.exports = {
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;
    if (releaseType === 'patch' && fix === 0) {
      return false;
    }
    return true;
  },
  testCommandBeforeRelease: () =>
    'yarn run lint && yarn run test && yarn run test:e2e',
  buildCommand: () => null,
  afterPublish: ({ exec }) => exec('yarn run release-templates'),
};
