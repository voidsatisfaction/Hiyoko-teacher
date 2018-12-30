import * as fs from 'fs'
import * as path from 'path'
import { HiyokoLogDBClient } from "../../hiyokoMantle/hiyokoLogDB";

(async () => {
  try {
    const logs = await HiyokoLogDBClient.getAllLogs()

    const csvTitle = `userId,productId,action,createdAt\n`
    const csvString = logs.map(log => {
      const { userId, productId, action, createdAt, content } = log
      // FIXME: content should be included
      return `${userId},${productId},${action},${createdAt}`
    }).join('\n')

    const csv = csvTitle + csvString

    fs.writeFileSync(path.join(__dirname, '/logs/logs.csv'), csv)

    console.log(csv)
  } catch(e) {
    console.error(e)
  }
})()