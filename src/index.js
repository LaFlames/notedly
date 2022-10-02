// index.js
// This is the main entry point of our application
import express from 'express';
import { gql, ApolloServer } from 'apollo-server-express';

const port = process.env.PORT || 4000;

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello wrld!'
  }
};

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(`Running at http://localhost:${port}${server.graphqlPath}`)
);
