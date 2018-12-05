export const PromiseSleep = (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}