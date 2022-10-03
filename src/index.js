import express from 'express';
import { gql, ApolloServer } from 'apollo-server-express';
import dataBase from './db.js';
import dotenv from 'dotenv';
import * as models from './models/index.js';

dotenv.config();

const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Query {
    hello: String!
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Mutation {
    addNote(content: String!): Note!
  }
`;

const resolvers = {
  Query: {
    notes: async () => {
      return await models.Note.find();
    },
    note: async (_, args) => {
      return await models.Note.findById(args.id);
    }
  },

  Mutation: {
    addNote: async (_, args) => {
      return await models.Note.create({
        content: args.content,
        author: 'Vitalik'
      });
    }
  }
};

const app = express();

dataBase.connect(DB_HOST);

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(`Running at http://localhost:${port}${server.graphqlPath}`)
);
