exports.typeDef = `
  type Product {
    id: ID!
    name: String!
    department: String!
    price: Float!
    sales: [Sale!]
  }

  type ProductSale {
    product: Product!
    total: Float!
  }

  extend type Query {
    getTopProductsSale(limit: Int): [ProductSale!]
  }
`;

exports.resolvers = {
  Query: {
    getTopProductsSale: (_, { limit = 5 }, { db }) => {
      return db.products
        .map(product => {
          const total = db.sales
            .filter({ productId: product.id })
            .reduce((total, sale) => {
              return total + sale.price;
            }, 0)
            .value();

          return {
            product,
            total
          };
        })
        .orderBy(['total'], ['desc'])
        .slice(0, limit)
        .value();
    }
  },
  Product: {
    sales: (_, args, { db }) => {
      return db.sales.filter({ productId: _.id }).value();
    }
  }
};
