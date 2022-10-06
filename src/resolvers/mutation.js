import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import dotenv from 'dotenv';

dotenv.config();

export const Mutation = {
  addNote: async (_, args, { models }) => {
    return await models.Note.create({
      content: args.content,
      author: 'Vitalik'
    });
  },
  deleteNote: async (_, { id }, { models }) => {
    try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (e) {
      return false;
    }
  },
  updateNote: async (_, { id, content }, { models }) => {
    return await models.Note.findOneAndUpdate(
      { _id: id },
      { $set: { content } },
      { new: true }
    );
  },
  signUp: async (_, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await models.User.create({
        username,
        email,
        password: hashedPassword
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);

      throw new Error('Error creating account');
    }
  },

  signIn: async (_, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }

    const user = await models.User.findOne({
      $or: [{ email }, { username }]
    });

    const valid = await bcrypt.compare(password, user.password);

    if (!user) {
      throw new AuthenticationError('Error signing in');
    }

    if (!valid) {
      throw new AuthenticationError('Wrong password');
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  }
};
