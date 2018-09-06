jest.mock('storybook-readme');

const { withReadme } = require('../');

const readmeApi = `<!-- start:api -->
## Api
<!-- end:api -->`;

const readmeUsage = `<!-- start:usage -->
## Usage
<!-- end:usage -->`;

const Readme = `
${readmeApi}

${readmeUsage}
`;

const Component = () => null;

describe('withReadme', () => {
  it('must include all the readme file', done => {
    const allReadme = withReadme(Readme)(Component);

    expect(allReadme).toMatch(Readme);

    done();
  });

  it('must include just some sections of the readme file', done => {
    const Component = () => null;
    const loadSections = withReadme(Readme);
    const usageReadmeSection = loadSections(['usage']);
    const withUsageReadmeSection = usageReadmeSection(Component);

    expect(withUsageReadmeSection).toMatch(readmeUsage);

    done();
  });

  it('must include all joined sections of the readme file', done => {
    const Component = () => null;
    const loadSections = withReadme(Readme);
    const allReadmeSections = loadSections(['api', 'usage']);
    const withAllReadmeSection = allReadmeSections(Component);
    const readmeApiAndUsage = `${readmeApi}${readmeUsage}`;

    expect(withAllReadmeSection).toMatch(readmeApiAndUsage);

    done();
  });
});
