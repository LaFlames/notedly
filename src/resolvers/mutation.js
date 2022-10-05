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
  }
};
