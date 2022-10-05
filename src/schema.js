import { gql } from 'apollo-server-express';

export const typeDefs = gql`
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
