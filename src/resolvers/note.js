export const Note = {
  author: async (note, _, { models }) => {
    return await models.User.findById(note.author);
  },
  favoritedBy: async (note, _, { models }) => {
    return await models.User.find({ _id: { $in: note.favoritedBy } });
  }
};
