export const deepClone = <T extends Object>(subject: T): T => {
  if (typeof subject !== "object" || subject === null) {
    return subject;
  }

  const result: T = (
    Array.isArray(subject) ? [...subject] : { ...subject }
  ) as T;

  for (let key in result) {
    if (typeof result[key] === "object") {
      result[key] = deepClone(result[key]);
    }
  }

  return result;
};

export const isObject = (subject: unknown): subject is object =>
  typeof subject === "object" && !Array.isArray(subject) && subject !== null;
