import * as ejs from 'ejs'

export class TemplateEngine {
  static async renderHTML(filePath: string, data: object): Promise<any> {
    return new Promise((resolve, reject) => {
      ejs.renderFile(filePath, data, (err: Error, html: string) => {
        if (err) {
          reject(err)
          return
        }

        resolve(html)
      })
    })
  }
}