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
  },
  noteFeed: async (_, { cursor }, { models }) => {
    const limit = 10;
    let hasNextPage = false;
    let cursorQuery = {};

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }

    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }

    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
  }
};
