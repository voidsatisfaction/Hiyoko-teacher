import axios from 'axios'

import { AdminHiyokoCoreClient } from "../../hiyokoMantle/hiyokoCore/admin";
import { CountCategory, ICountSummary } from "../../hiyokoMantle/model/CountSummary";
import { DateTime } from "../../util/DateTime";

const UN_PLANNED_MESSAGE = `
아직 이번 주 공부 계획을 세우지 않으셨네요.

계획을 적절히 세우고 단어 공부를 한다면 보다 효율적으로 단어를 습득하실 수 있습니다.

계획은 메뉴 하단의 Study Management 부분을 터치하시면 작성하실 수 있습니다.

You haven't made any plans for this week's study yet.

If you plan properly and study the words, you can learn them more effectively.

You can create the plan by touching the Study Management section at the bottom of the menu.
`.trim()

const UN_ACCOMPLISHED_MESSAGE = `
오늘의 목표를 달성해 주세요

아직 오늘 세우신 계획만큼 "단어 추가 개수" 혹은 "퀴즈 수험 횟수"가 달성 되지 않았습니다.

여러분의 작은 노력이 큰 성공을 만듭니다.

Please meet today's goal (number of word additions or number of quiz examinations)

You have not yet achieved your plan to add words or take quiz.

Your little effort makes you a big success.
`.trim()

export async function planCheck() {
  const users = await AdminHiyokoCoreClient.listAllUsers()

  const v1Users = users.filter(user => user.productId === 1)
  const v1UserIds = v1Users.map(user => user.userId)

  const now = new DateTime()

  const [
    planAddingVocabularyLists,
    planTakingQuizzes,
    addingVocabularyLists,
    takingQuizzes,
  ] = await Promise.all([
    AdminHiyokoCoreClient.getCountSummaries(
      v1UserIds,
      CountCategory.planAddingVocabularyList,
      now.toDateString()
    ),
    AdminHiyokoCoreClient.getCountSummaries(
      v1UserIds,
      CountCategory.planTakingQuiz,
      now.toDateString()
    ),
    AdminHiyokoCoreClient.getCountSummaries(
      v1UserIds,
      CountCategory.addingVocabularyList,
      now.toDateString()
    ),
    AdminHiyokoCoreClient.getCountSummaries(
      v1UserIds,
      CountCategory.takingQuiz,
      now.toDateString()
    ),
  ])

  const [unPlannedUserIdSet, plannedUserIdSet] = [
    ...planAddingVocabularyLists,
    ...planTakingQuizzes
  ].reduce((acc, userPlan) => {
    const [unPlannedUserIdSet, plannedUserIdSet] = acc
    const userId = userPlan.userId
    if (!userPlan.countSummary) {
      unPlannedUserIdSet.add(userId)
      plannedUserIdSet.delete(userId)
    }
    if (!unPlannedUserIdSet.has(userId)) {
      plannedUserIdSet.add(userId)
    }
    return acc
  }, [new Set<string>(), new Set<string>()])

  const [
    userIdPlanAddingVocabularyListMap,
    userIdPlanTakingQuizzes,
    userIdAddingVocabularyLists,
    userIdTakingQuizzes
  ] = [
    planAddingVocabularyLists,
    planTakingQuizzes,
    addingVocabularyLists,
    takingQuizzes,
  ].map(convertToUserIdMap)

  const unAccomplishedUserIds = new Set<string>()
  plannedUserIdSet.forEach((userId: string) => {
    const [plan1, plan2] = [userIdPlanAddingVocabularyListMap[userId], userIdPlanTakingQuizzes[userId]]
    const [done1, done2] = [userIdAddingVocabularyLists[userId], userIdTakingQuizzes[userId]]
    if (
      !done1 || !done2 ||
      (done1.count < plan1.count) ||
      (done2.count < plan2.count)
    ) {
      unAccomplishedUserIds.add(userId)
    }
  })

  // send push message
  sendPushMessage(unPlannedUserIdSet, UN_PLANNED_MESSAGE)
  sendPushMessage(unAccomplishedUserIds, UN_ACCOMPLISHED_MESSAGE)
}

function convertToUserIdMap(countSummaries: { userId: string, countSummary: ICountSummary }[]): { [key: string]: ICountSummary } {
  return countSummaries.reduce((acc, plan) => {
    acc[plan.userId] = plan.countSummary
    return acc
  }, {})
}

async function sendPushMessage(idSet: Set<string>, message: string): Promise<void> {
  if (idSet.size === 0) {
    return
  }

  try {
    await axios.post(`${process.env.LAMBDA_URL}/pusher/message/users`, {
      userIds: [...idSet],
      message
    })
  } catch(e) {
    console.error(e)
  }
}