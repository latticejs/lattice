module.exports = collection => (_, { filterBy = [], orderBy = [], first = 10, after }, { db }) => {
  let ordersField = [];
  let ordersDirection = [];
  let offset = 0;

  if (orderBy) {
    orderBy.forEach(order => {
      ordersField.push(order.field);
      ordersDirection.push(order.direction);
    });
  }

  const list = db[collection]
    .filter(row => {
      return filterBy.reduce((result, next) => {
        const left = row[next.field];
        const right = next.value;

        const operator = next.operator || 'LIKE';

        switch (operator) {
          case 'LIKE':
            return result && left.toLowerCase().includes(right.toLowerCase());
          case 'EQUAL':
            return result && left === right;
          case 'NOT_LIKE':
            return result && !left.toLowerCase().includes(right.toLowerCase());
          case 'NOT_EQUAL':
            return result && left !== right;
          default:
            return result;
        }
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
    offset = parseInt(Buffer.from(after, 'base64').toString('ascii'), 10) + 1;
  }

  const endIndex = offset + (first === 0 ? 1 : first);

  const edges = list
    .slice(offset, endIndex)
    .value()
    .map((node, key) => ({
      node,
      cursor: Buffer.from((key + offset).toString()).toString('base64'),
      position: key + offset
    }));

  const endCursor = edges[edges.length - 1].cursor;
  const hasNextPage = list.last().id !== edges[edges.length - 1].id;

  return {
    totalCount: list.value().length,
    edges,
    pageInfo: {
      endCursor,
      hasNextPage
    }
  };
};
