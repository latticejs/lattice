const StorybookReadme = jest.genMockFromModule('storybook-readme');

StorybookReadme.withReadme = readme => readme;

module.exports = StorybookReadme;
