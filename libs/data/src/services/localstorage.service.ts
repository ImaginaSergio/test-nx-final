export const setItemWithExpire = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const setItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key: string) => {
  let itemStr = localStorage.getItem(key);

  // Si no existe el item, buscamos en la sessionStorage
  if (!itemStr) itemStr = sessionStorage.getItem(key);

  if (!itemStr) return null;
  else return JSON.parse(itemStr);
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};
