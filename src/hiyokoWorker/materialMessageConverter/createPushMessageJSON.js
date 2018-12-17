const path = require('path')
const fs = require('fs')

function compose(...fns) {
  return function(arg) {
    return fns.reduce((res, fn) => fn(res), arg)
  }
}

function parseRawLocalJSON({ location }) {
  const jsonData = require(path.join(__dirname, location))

  return ({ jsonData })
}

function toPushMessageString({ jsonData }) {
  const { Date, VideoURL, TranscriptURL, Themes } = jsonData

  const message = `

${Date}

=====Material URLs=====
Video: ${VideoURL}

Transcript: ${TranscriptURL}

====Video Contents====

${Themes.reduce((str, themeData) => str + `${themeData.Time}\n${themeData.Theme}\n\n`, '')}
`

  return ({ jsonData, message: message.trim() })
}

function savePushMessageJSON({ jsonData, message }) {
  const target = { message }
  const jsonString = JSON.stringify(target).trim()
  fs.writeFile(path.join(__dirname, `/pushMessageJSON/${jsonData.Date}.json`), jsonString, 'utf8', (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`${message}`)
  })
}

const createPushMessageJSON = compose(
  parseRawLocalJSON,
  toPushMessageString,
  savePushMessageJSON
)

const argv = process.argv
const location = argv[2]
if (!location) {
  throw `location is not set`
}

createPushMessageJSON({ location })