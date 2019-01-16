import * as fs from 'fs'
import * as path from 'path'
import { HiyokoLogDBClient } from "../../hiyokoMantle/hiyokoLogDB";

(async () => {
  try {
    const logs = await HiyokoLogDBClient.getAllLogs()

    const sanitizedLogs = logs.map(log => {
      if (log.action === 'set-plan-achievement') {
        const newContent = log.content.map(c => {
          return ({
            ...c,
            date: c.date.value._i
          })
        })

        return ({
          ...log,
          content: newContent
        })
      } else if (log.action === 'get-simple-quizzes' || log.action === 'get-composite-quizzes') {
        const newContent = log.content.map(c => {
          return ({
            ...c,
            createdAt: null
          })
        })

        return ({
          ...log,
          content: newContent
        })
      }
      return log
    })

    fs.writeFileSync(path.join(__dirname, '/logs/logs.json'), JSON.stringify(sanitizedLogs))
  } catch (e) {
    console.error(e)
  }
})()