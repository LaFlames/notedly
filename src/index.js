import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dataBase from './db.js';
import dotenv from 'dotenv';
import * as models from './models/index.js';
import { resolvers } from './resolvers/index.js';
import { typeDefs } from './schema.js';

dotenv.config();

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

dataBase.connect(DB_HOST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models };
  }
});

server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(`Running at http://localhost:${port}${server.graphqlPath}`)
);
