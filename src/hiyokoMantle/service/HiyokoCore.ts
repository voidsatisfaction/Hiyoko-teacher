import { HiyokoCoreClient } from "../hiyokoCore"
import { IVocabularyList } from "../model/VocabularyList";

interface INormalizedVocabularyLists {
  byDate: {
    [date: string]: IVocabularyList[]
  },
  allDates: string[]
}

export class HiyokoCoreService {
  static async getAndProcessUserVocabularyLists(userId: string): Promise<INormalizedVocabularyLists> {
    try {
      const vocabularyLists = await HiyokoCoreClient.getUserVocabularyLists(userId)

      // TODO: this can be abstracted as general normalizer
      const normalizedVocabularyLists = vocabularyLists.reduce((acc, vocabularyList: IVocabularyList) => {
        const YYYYMMDD = vocabularyList.createdAt.slice(0, 10)

        if (!acc.byDate[YYYYMMDD]) {
          acc.allDates.push(YYYYMMDD)
          acc.byDate[YYYYMMDD] = []
        }
        acc.byDate[YYYYMMDD].push(vocabularyList)

        return acc
      }, { byDate: {}, allDates: [] })

      return normalizedVocabularyLists
    } catch(error) {
      throw error
    }
  }
}