// import React from 'react';
// import JssProvider from 'react-jss/lib/JssProvider';
// import { createGenerateClassName } from '@material-ui/core/styles';
import { withReadme as withReadmeBase } from 'storybook-readme';

const getSection = (html, id) => {
  const start = `<!-- start:${id} -->`;
  const end = `<!-- end:${id} -->`;
  return html.slice(html.indexOf(start), html.indexOf(end) + end.length);
};

const concatSections = (html, sections = []) => {
  return sections.map(id => getSection(html, id)).join('');
};

export const withReadme = readme => {
  return (sections = []) => {
    if (typeof sections === 'function') {
      return withReadmeBase(readme, sections);
    }

    return component => {
      if (sections.length === 0) {
        return withReadmeBase(readme, component);
      }

      return withReadmeBase(concatSections(readme, sections), component);
    };
  };
};

// module.exports.JssDecorator = story => (
//   <JssProvider
//     generateClassName={createGenerateClassName({
//       dangerouslyUseGlobalCSS: true,
//       productionPrefix: 'c'
//     })}
//   >
//     {story()}
//   </JssProvider>
// );
