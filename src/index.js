import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
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

const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      new Error('Session invalid');
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization;

    const user = getUser(token);

    return { models, user };
  }
});

server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(`Running at http://localhost:${port}${server.graphqlPath}`)
);
