import { withReadme as withReadmeBase } from 'storybook-readme';

const getSection = (html, id) => {
  const start = `<!-- start:${id} -->`;
  const end = `<!-- end:${id} -->`;
  return html.slice(html.indexOf(start), html.indexOf(end) + end.length);
};

const concatSections = (html, sections = []) => {
  return sections.map((id) => getSection(html, id)).join('');
};

export const withReadme = (readme = '') => {
  return (sections = []) => {
    // Return final storybook readme HOC if not sections provided
    if (typeof sections === 'function') {
      // sections = a component
      return withReadmeBase(readme, sections);
    }

    return (component) => {
      if (sections.length === 0) {
        return withReadmeBase(readme, component);
      }

      return withReadmeBase(concatSections(readme, sections), component);
    };
  };
};
