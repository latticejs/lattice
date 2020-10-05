const { rule, shield } = require('graphql-shield');

// Rules

const isAuthenticated = rule()(async (_, args, ctx, info) => {
  return !!ctx.currentUser;
});

//const isAdmin = and(
//isAuthenticated,
//rule()(async (_, args, ctx, info) => {
//return ctx.currentUser.role === 'admin';
//})
//);

//const isAnalyst = and(
//isAuthenticated,
//rule()(async (_, args, ctx, info) => {
//return ctx.currentUser.role === 'analyst';
//})
//);

// Permissions

module.exports = shield({
  Query: {
    currentUser: isAuthenticated,
  },
  Mutation: {},
});
