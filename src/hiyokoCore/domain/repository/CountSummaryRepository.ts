import { CountCategory, CountSummaryEntity } from "../model/CountSummary";
import { DateString } from "../../../util/Date";

export interface ICountSummaryRepository {
  countSummaryLoader: () => ICountSummaryLoader
}

export interface ICountSummaryLoader {
  findAll(
    userId: string,
    countCategory: CountCategory,
    dates: DateString[]
  ): Promise<CountSummaryEntity[]>
}