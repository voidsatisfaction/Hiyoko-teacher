import { expect } from 'chai'
import { DateTime } from '../../../src/util/Date'

describe('Util/DateTime', () => {
  describe('appropriate timezone', () => {
    it('should be expected timezone time', () => {
      const dateTime = new DateTime()

      const dateTimeWithParameter = new DateTime(new Date)

      console.log(dateTime, dateTimeWithParameter)
    })
  })
})