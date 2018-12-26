import { planCheck } from ".";
import { DateTime } from "../../util/DateTime";

function cron() {
  setInterval(async () => {
    const now = new DateTime()
    if (
      now.toHourMinuteString() === '17:00' ||
      now.toHourMinuteString() === '21:00'
    ) {
      await planCheck()
    }
    console.log('working...')
  }, 60 * 1000)
}

cron()