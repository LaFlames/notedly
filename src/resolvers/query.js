export const Query = {
  notes: async (_, __, { models }) => {
    return await models.Note.find();
  },
  note: async (_, args, { models }) => {
    return await models.Note.findById(args.id);
  },
  users: async (_, __, { models }) => {
    return await models.User.find();
  },
  user: async (_, { username }, { models }) => {
    return await models.User.findOne({ username });
  },
  me: async (_, __, { models, user }) => {
    return await models.User.findById(user.id);
  }
};
