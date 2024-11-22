export const logger = new Proxy(console, {
  get(target, prop: keyof Console) {
    if (prop === 'log') {
      return (...args: any[]) => {
        if (process.env.DISCOVERY_DEBUG === 'true') {
          target.log(...args);
        }
      };
    }
    return target[prop];
  }
});
