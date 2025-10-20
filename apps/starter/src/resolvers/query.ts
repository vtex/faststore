export const Query = {
  MyCustomQuery: async (_, __, ctx) => {
    return ctx.str ?? 'Empty context string'
  },
}
