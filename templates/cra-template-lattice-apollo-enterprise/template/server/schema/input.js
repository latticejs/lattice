exports.typeDef = `
  enum Operator {
    EQUAL
    LIKE
    NOT_EQUAL
    NOT_LIKE
  }

  input Filter {
    field: String!
    value: String
    operator: Operator
  }

  input Order {
    field: String!
    direction: String!
  }
`;
