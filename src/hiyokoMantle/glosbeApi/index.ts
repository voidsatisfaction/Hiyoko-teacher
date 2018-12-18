import axios, { AxiosInstance } from 'axios'

export class GlosbeClient {
  readonly client: AxiosInstance
  constructor() {
    this.client = axios.create({
      baseURL: 'https://glosbe.com/gapi/',
      headers: {
        'User-Agent': 'Hiyoko teacher application - 1.0.0 Thank you for providing nice api',
      }
    })
  }

  async getTranslationOf(vocabulary: string, dest: string = 'ko', num: number = 4) {
    const from: string = 'en'
    // FIXME: it should be fixed to multiple language
    const format: string = 'json'
    const pretty: string = 'true'
    const res = await this.client.get('/translate', {
      params: {
        from,
        dest,
        format,
        pretty,
        phrase: vocabulary
      }
    })

    // ['거절하다', '볼륨을 내리다']
    return res.data.tuc.slice(0, num).filter(d => d.phrase).map(d => d.phrase.text)
  }
}