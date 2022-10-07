import { Query } from './query.js';
import { Mutation } from './mutation.js';
import { User } from './user.js';
import { Note } from './note.js';
import pkg from 'graphql-iso-date';

export const resolvers = {
  Query,
  Mutation,
  Note,
  User,
  DateTime: pkg.GraphQLDateTime
};
