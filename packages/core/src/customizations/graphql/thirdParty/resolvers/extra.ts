const extraDataResolver = {
  Query: {
    extraData: () => {
      return {
        data: 'Extra data',
      }
    },
    namedExtraData: (_, { name }) => {
      return {
        data: `Named extra data: ${name}`,
      }
    },
  },
}

export default extraDataResolver
