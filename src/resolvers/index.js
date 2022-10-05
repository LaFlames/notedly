import { Query } from './query.js';
import { Mutation } from './mutation.js';
import pkg from 'graphql-iso-date';

export const resolvers = { Query, Mutation, DateTime: pkg.GraphQLDateTime };
