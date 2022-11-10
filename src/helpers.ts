let gId = 0;

export const genGlobalID = () => {
  return ++gId;
};

export const logD = (...args: any[]) => __dev__ && console.log(...args);

export const nameEnum = (en: any) =>
  Object.keys(en).filter((item) => !Number.isInteger(Number(item)));

export type MayBeEmpty<T> = T | null | undefined;

/**
 * Add or remove attribute in element
 * @param attr: attribute will add
 * @param isAdd: if true is add else remove
 */
export const updateAttribute = (el: Element, attr: string, isAdd: boolean) => {
  if (isAdd) {
    if (!el.hasAttribute(attr)) {
      el.setAttribute(attr, '');
    }
  } else {
    if (el.hasAttribute(attr)) {
      el.removeAttribute(attr);
    }
  }
};
