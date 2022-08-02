const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const elapsedMS = (start: number) => (performance.now() - start);

export const waitFor = async (cb: () => void | Promise<void>, ms = 2e3) => {
  const start = performance.now();

  while (elapsedMS(start) < ms) {
    try {
      await sleep(100);
      await cb();

      return;
    } catch (err) {
      continue;
    }
  }

  throw new Error(`Timed out after ${ms}ms`)
};
