export const getValueByKey = (
  arr: { [key: string]: any }[],
  key: string,
  df: string
): string => {
  const obj = arr.find((o) => o.hasOwnProperty(key))
  return obj ? obj[key] : df
}
