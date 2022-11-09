let gId = 0;

export const genGlobalID = () => {
  return ++gId;
};

export const logD = (...args: any[]) => __dev__ && console.log(...args);

export const nameEnum = (en: any) =>
  Object.keys(en).filter((item) => !Number.isInteger(Number(item)));
