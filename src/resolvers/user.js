export const User = {
  notes: async (user, _, { models }) => {
    return await models.Note.find({ author: user._id }).sort({ _id: -1 });
  },
  favoriteNotes: async (user, _, { models }) => {
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
  }
};
