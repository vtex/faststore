export const emptyOrderForm = {
  items: [],
}

export const noAssemblyOptionsOrderForm = {
  items: [
    {
      id: '0',
      parentItemIndex: null,
    },
    {
      id: '1',
      parentItemIndex: null,
    },
    {
      id: '2',
      parentItemIndex: null,
    },
    {
      id: '3',
      parentItemIndex: null,
    },
  ],
}

export const oneLevelAssemblyOptionsOrderForm = {
  items: [
    {
      id: '0',
      parentItemIndex: null,
    },
    {
      id: '1',
      parentItemIndex: 0,
    },
    {
      id: '2',
      parentItemIndex: 0,
    },
    {
      id: '3',
      parentItemIndex: 0,
    },
  ],
}

export const twoLevelsAssemblyOptionsOrderForm = {
  items: [
    {
      id: '0',
      parentItemIndex: null,
    },
    {
      id: '1',
      parentItemIndex: 0,
    },
    {
      id: '2',
      parentItemIndex: 0,
    },
    {
      id: '3',
      parentItemIndex: 1,
    },
  ],
}

export const complexAssemblyOptionsOrderForm = {
  items: [
    {
      id: '0',
      parentItemIndex: null,
    },
    {
      id: '1',
      parentItemIndex: 0,
    },
    {
      id: '2',
      parentItemIndex: 0,
    },
    {
      id: '3',
      parentItemIndex: 1,
    },
    {
      id: '4',
      parentItemIndex: 3,
    },
    {
      id: '5',
      parentItemIndex: null,
    },
    {
      id: '6',
      parentItemIndex: 5,
    },
    {
      id: '7',
      parentItemIndex: 5,
    },
    {
      id: '8',
      parentItemIndex: null,
    },
    {
      id: '9',
      parentItemIndex: 6,
    },
    {
      id: '10',
      parentItemIndex: 7,
    },
  ],
}

export const testContext = {
  loaders: {
    skuLoader: {
      load: () => {
        return null
      },
    },
  },
}
