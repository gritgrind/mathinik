import type { Activity } from '~/lib/content/types'

export type ActivityAttempt =
  | {
      kind: 'equation-builder'
      left: Array<string | null>
      right: Array<string | null>
    }
  | {
      kind: 'object-manipulation'
      groupCounts: number[]
      totalCount: number
    }
  | {
      kind: 'multiple-choice'
      selectedChoiceIds: string[]
    }
  | {
      kind: 'numeric-input'
      value: string
    }

export type ActivityEvaluation = {
  correct: boolean
  successMode: Activity['success']['mode']
}

export function evaluateActivity(
  activity: Activity,
  attempt: ActivityAttempt
): ActivityEvaluation {
  switch (activity.success.mode) {
    case 'exact-match':
      if (
        activity.content.kind !== 'equation-builder' ||
        attempt.kind !== 'equation-builder'
      ) {
        return { correct: false, successMode: activity.success.mode }
      }

      return {
        correct: activity.content.validAnswers.some(
          (answer) =>
            arraysMatch(attempt.left, answer.left) &&
            arraysMatch(attempt.right, answer.right)
        ),
        successMode: activity.success.mode,
      }

    case 'set-match':
      if (
        activity.content.kind !== 'object-manipulation' ||
        attempt.kind !== 'object-manipulation'
      ) {
        return { correct: false, successMode: activity.success.mode }
      }

      return {
        correct: activity.content.validAnswers.some((answer) => {
          if (answer.expectedGroups) {
            return arraysMatch(
              [...attempt.groupCounts].sort((left, right) => right - left),
              [...answer.expectedGroups].sort((left, right) => right - left)
            )
          }

          if (answer.expectedCount !== undefined) {
            return attempt.totalCount === answer.expectedCount
          }

          return false
        }),
        successMode: activity.success.mode,
      }

    case 'choice-match':
      if (
        activity.content.kind !== 'multiple-choice' ||
        attempt.kind !== 'multiple-choice'
      ) {
        return { correct: false, successMode: activity.success.mode }
      }

      return {
        correct: arraysMatch(
          [...attempt.selectedChoiceIds].sort(),
          [...activity.content.correctChoiceIds].sort()
        ),
        successMode: activity.success.mode,
      }

    case 'numeric-match':
      if (
        activity.content.kind !== 'numeric-input' ||
        attempt.kind !== 'numeric-input'
      ) {
        return { correct: false, successMode: activity.success.mode }
      }

      return {
        correct: activity.content.acceptedAnswers
          .map((answer) => String(answer))
          .includes(attempt.value.trim()),
        successMode: activity.success.mode,
      }
  }
}

function arraysMatch(
  current: Array<string | null> | number[],
  expected: Array<string | null> | number[]
) {
  return (
    current.length === expected.length &&
    current.every((value, index) => value === expected[index])
  )
}
