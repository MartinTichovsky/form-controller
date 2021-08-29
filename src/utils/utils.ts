export const wait = async (timeout: number) =>
  new Promise((executor) => setTimeout(executor, timeout));
