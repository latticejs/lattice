module.exports = collection => (_, { filterBy = [], orderBy = [], first = 10, after }, { db }) => {
  let ordersField = [];
  let ordersDirection = [];
  let cursorDate;

  if (orderBy) {
    orderBy.forEach(order => {
      ordersField.push(order.field);
      ordersDirection.push(order.direction);
    });
  }

  const list = db[collection]
    .filter(row => {
      return filterBy.reduce((result, next) => {
        return result && row[next.field].toLowerCase().includes(next.value.toLowerCase());
      }, true);
    })
    .orderBy(ordersField, ordersDirection);

  if (list.value().length === 0) {
    return {
      totalCount: 0,
      edges: [],
      pageInfo: {
        endCursor: null,
        hasNextPage: false
      }
    };
  }

  if (after) {
    cursorDate = parseInt(Buffer.from(after, 'base64').toString('ascii'), 10);
  } else {
    cursorDate = list.first().value().createdAt;
  }

  const newIndex = list.findIndex({ createdAt: cursorDate }).value();
  const startIndex = after ? newIndex + 1 : newIndex;
  const endIndex = startIndex + first;

  const edges = list
    .slice(startIndex, endIndex)
    .value()
    .map(node => ({
      node,
      cursor: Buffer.from(node.createdAt.toString()).toString('base64')
    }));

  const endCursor = edges[edges.length - 1].cursor;

  const finalCursor = Buffer.from(
    list
      .last()
      .value()
      .createdAt.toString()
  ).toString('base64');

  const hasNextPage = !edges.find(edge => edge.cursor === finalCursor);

  return {
    totalCount: list.value().length,
    edges,
    pageInfo: {
      endCursor,
      hasNextPage
    }
  };
};
