export const Mutation = {
  addNote: async (_, args, { models }) => {
    return await models.Note.create({
      content: args.content,
      author: 'Vitalik'
    });
  }
};
