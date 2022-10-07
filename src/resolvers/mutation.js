import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const Mutation = {
  addNote: async (_, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id)
    });
  },

  deleteNote: async (_, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to delete the note");
    }

    try {
      await note.remove();
      return true;
    } catch (e) {
      return false;
    }
  },

  updateNote: async (_, { id, content }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to delete the note");
    }

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
  },

  toggleFavorite: async (_, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError();
    }

    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);

    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          new: true
        }
      );
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      );
    }
  }
};
