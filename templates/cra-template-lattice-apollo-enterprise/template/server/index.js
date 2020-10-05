const { GraphQLServer } = require('graphql-yoga');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { typeDefs, resolvers } = require('./schema');
const permissions = require('./permissions');

const opts = {
  port: process.env.NODE_PORT || 3001,
};

(async () => {
  const db = await require('./db')();

  // context
  const context = ({ request }) => ({
    db,
    currentUser: request.currentUser,
  });

  // server
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    middlewares: [permissions],
    context,
  });

  server.express.use(cors());

  // jwt middleware
  server.express.use(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const currentUser = await jwt.verify(token, process.env.SECRET || 'aSecret');
        req.currentUser = currentUser;
      } catch (e) {
        const error = 'Your session expired. Sign in again.';
        return res.status(401).json({ error });
      }
    }

    next();
  });

  server.start(opts, () => console.log(`Server is running on http://localhost:${opts.port}`));
})();
