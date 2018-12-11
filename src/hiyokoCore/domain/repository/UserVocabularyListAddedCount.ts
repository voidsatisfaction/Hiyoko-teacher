import { UserVocabularyListAddedCountEntity } from "../model/UserVocabularyListAddedCount";
import { DateString } from "../../../util/Date";

export interface IUserVocabularyListAddedCountRepository {
  userVocabulayListAddedCountLoader: () => IUserVocabularyListAddedCountLoader
}

export interface IUserVocabularyListAddedCountLoader {
  findAll(userId: string, dates: DateString[]): Promise<UserVocabularyListAddedCountEntity[]>
}