export type DateString = string

export function getThisWeekDateString(date: Date): DateString[] {
  const thisWeekDateStrings = []

  // JST based mondayDate
  const mondayDate = getThisWeekMondayDate(date)
  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayDate)
    date.setHours(17 + 24 * i)

    thisWeekDateStrings.push(date)
  }

  return thisWeekDateStrings.map((date: Date) => date.toLocaleDateString())
}

export function getThisWeekMondayDate(date: Date): Date {
  const day = date.getDay() || 7
  const newDate = new Date(date)
  if (day !== 1) {
    // ???: setHours are based on local time
    newDate.setHours(-7 + (-24) * (day-2))
  }

  return newDate
}