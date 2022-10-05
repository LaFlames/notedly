export const Query = {
  notes: async (_, __, { models }) => {
    return await models.Note.find();
  },
  note: async (_, args, { models }) => {
    return await models.Note.findById(args.id);
  }
};
