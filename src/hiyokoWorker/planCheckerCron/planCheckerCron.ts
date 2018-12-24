import { planCheck } from ".";
import { DateTime } from "../../util/DateTime";

function cron() {
  setInterval(async () => {
    if (
      new DateTime().toHourMinuteString() === '20:00'
    ) {
      await planCheck()
    }
    console.log('working...')
  }, 60 * 1000)
}

cron()