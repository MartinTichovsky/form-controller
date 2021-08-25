export const sleep = async (timeout: number) =>
  new Promise((executor) => setTimeout(executor, timeout));
