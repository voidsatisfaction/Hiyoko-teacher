import { expect } from 'chai'
import { DateTime } from '../../../src/util/DateTime'

describe('Util/DateTime', () => {
  describe('appropriate timezone', () => {
    it('should be expected timezone time', () => {
      const dateTime = new DateTime()

      const dateTimeWithParameter = new DateTime(new Date)

      const dateTimeWithStringParamter = new DateTime('2018-12-12T13:00:40.000')

      expect(dateTime).to.be.instanceOf(DateTime)
      expect(dateTimeWithParameter).to.be.instanceOf(DateTime)
      expect(dateTimeWithStringParamter).to.be.instanceOf(DateTime)
      expect(dateTimeWithStringParamter.toDateString()).to.be.equal('2018-12-12')
      expect(dateTimeWithStringParamter.toDateTimeString()).to.be.equal('2018-12-12T13:00:40.000')
      // with z, parse it as raw data
      expect(dateTimeWithStringParamter.toDate()).to.be.deep.equal(new Date('2018-12-12T04:00:40.000Z'))
    })
  })
})