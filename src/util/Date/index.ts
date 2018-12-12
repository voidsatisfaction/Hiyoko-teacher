// import * as moment from 'moment'
import * as moment from 'moment-timezone'

moment().tz('Asia/Tokyo').format()

export class DateTime {
  private value: moment.Moment

  constructor(input?: any) {
    if (input) {
      this.value = moment(input)
      return
    }
    this.value = moment()
  }

  toDateTimeString(): string {
    return this.value.toISOString()
  }

  toDateString(): string {
    return this.value.format('YYYY-MM-DD')
  }
}

export type DateString = string

export function getThisWeekDateStrings(date: Date): DateString[] {
  const thisWeekDateStrings = []

  // JST based mondayDate
  const mondayDate = getThisWeekMondayDate(date)
  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayDate)
    date.setHours(17 + 24 * i)

    thisWeekDateStrings.push(date)
  }

  // FIXME: UTC -> 06/03/2018, JST -> 2018-10-11
  return thisWeekDateStrings.map((date: Date) => swap(date.toLocaleDateString().split('/').reverse(), 1, 2).join('-'))
}

export function getThisWeekMondayDate(date: Date): Date {
  const momentDate = moment(date)
  console.log(date.toISOString())
  console.log(momentDate)
  console.log(momentDate.weekday())
  const day = date.getDay() || 7
  const newDate = new Date(date)
  if (day !== 1) {
    // ???: setHours are based on local time
    newDate.setHours(-7 + (-24) * (day-2))
  }

  return newDate
}

function swap(array: Array<any>, i: number, j: number): Array<any> {
  let temp: any
  return array.map((e, k) => {
    if (k === i) {
      temp = e
      return array[j]
    } else if (k === j) {
      return temp
    }
    return e
  })
}