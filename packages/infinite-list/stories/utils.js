export const getSection = (html, id) => {
  const start = `<!-- start:${id} -->`;
  const end = `<!-- end:${id} -->`;
  return html.slice(html.indexOf(start), html.indexOf(end) + end.length);
};

export const concatSections = (html, sections = []) => {
  return sections.map(id => getSection(html, id)).join('');
};

export default () => {};
