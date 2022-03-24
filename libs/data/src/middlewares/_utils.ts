/** Convertimos la query de array en texto */
export const extractQuery = (query: any[] = []) => {
  let queryTxt: string = '?',
    errors: any;

  query?.forEach((item: any) => {
    let [key, value] = Object.entries(item)[0];

    queryTxt += `&${key}=${value}`;
  });

  return [queryTxt, errors];
};
