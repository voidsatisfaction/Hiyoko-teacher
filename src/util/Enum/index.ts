export const enumIncludes = (e: any, value: any): boolean => {
  return (<any>Object).values(e).includes(value)
}