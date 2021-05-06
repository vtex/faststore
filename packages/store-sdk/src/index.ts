export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    // eslint-disable-next-line no-console
    console.log('boop');
  }

  return a + b;
};
