// import * as moment from 'moment'
import * as moment from 'moment-timezone'

moment().tz('Asia/Tokyo').format()

export type DateString = string

export class DateTime {
  private value: moment.Moment

  constructor(input?: any) {
    if (input instanceof DateTime) {
      this.value = moment(input.value)
      return
    }
    if (input) {
      this.value = moment(input)
      return
    }
    this.value = moment()
  }

  static getThisWeekDateStrings(dateTime: DateTime): DateString[] {
    const thisWeekDateStrings = []
    let thisWeekDateTime = this.getThisWeekMondayDateTime(dateTime)

    for (let i = 0; i < 7; i++) {
      thisWeekDateStrings.push(thisWeekDateTime.toDateString())

      thisWeekDateTime = thisWeekDateTime.add(1, 'days')
    }

    return thisWeekDateStrings
  }

  static getThisWeekMondayDateTime(dateTime: DateTime): DateTime {
    let dayOffset
    if (dateTime.value.weekday() === 0) {
      dayOffset = 6
    } else {
      dayOffset = dateTime.value.weekday() - 1
    }

    const newDateTime = new DateTime(dateTime)
    newDateTime.value
      .subtract(dayOffset, 'days')
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)

    return newDateTime
  }

  add(amount: number, b: 'days' | 'hours' | 'minutes' | 'seconds'): DateTime {
    this.value.add(amount, b)
    return new DateTime(this)
  }

  toDateTimeString(): string {
    return this.value.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
  }

  toDateString(): string {
    return this.value.format('YYYY-MM-DD')
  }

  toDate(): Date {
    return this.value.add(9, 'hours').toDate()
  }
}
