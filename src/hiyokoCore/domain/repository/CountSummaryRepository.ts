import { CountCategory, CountSummaryEntity } from "../model/CountSummary"
import { DateString, DateTime } from "../../../util/DateTime"
import { UserEntity } from "../model/User";

export interface ICountSummaryRepository {
  countSummaryAction: () => ICountSummaryAction
  countSummaryLoader: () => ICountSummaryLoader
}

export interface ICountSummaryAction {
  createOrUpdate(
    userEntity: UserEntity,
    countCategory: CountCategory,
    dateTime: DateTime
  ): Promise<void>

  bulkCreateOrUpdate(
    userEntity: UserEntity,
    countSummaryEntities: CountSummaryEntity[]
  ): Promise<CountSummaryEntity[]>
}

export interface ICountSummaryLoader {
  findAll(
    userId: string,
    countCategory: CountCategory,
    dates: DateString[]
  ): Promise<CountSummaryEntity[]>

  find(
    userId: string,
    countCategory: CountCategory,
    date: DateString
  ): Promise<CountSummaryEntity>

  findAllByCountCategoryAndUserIdsAndDate(
    userIds: string[],
    countCategory: CountCategory,
    date: DateString
  ): Promise<CountSummaryEntity[]>
}