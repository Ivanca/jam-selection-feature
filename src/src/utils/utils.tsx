/* eslint-disable @typescript-eslint/no-explicit-any */
export const copyPropsFromObject = (
  obj: { [key: string]: any },
  propsAllowed: string[]
): { [key: string]: any } => {
  const newObj = {} as { [key: string]: any };
  /* eslint-disable no-restricted-syntax */
  for (const key in obj) {
    if (propsAllowed.includes(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export const simpleCompareObjEquality = (
  obj1: { [key: string]: any } | null,
  obj2: { [key: string]: any } | null
) => {
  if (obj1 === null && obj2 === null) {
    return true;
  }
  if (obj1 === null || obj2 === null) {
    return false;
  }
  /* eslint-disable no-restricted-syntax */
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  /* eslint-disable no-restricted-syntax */
  for (const key in obj2) {
    if (obj2[key] !== obj1[key]) {
      return false;
    }
  }
  return true;
};
