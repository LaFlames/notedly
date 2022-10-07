import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar DateTime

  type Note {
    id: ID!
    content: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User!]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    notes: [Note!]!
    favoriteNotes: [Note!]!
  }

  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
    users: [User!]!
    user(username: String!): User!
    me: User!
  }

  type Mutation {
    addNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    toggleFavorite(id: ID!): Note!
  }
`;
