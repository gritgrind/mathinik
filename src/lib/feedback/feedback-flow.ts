import type { Activity } from '~/lib/content/types'

export type ActivityAttemptRecord = {
  correct: boolean
}

export type FeedbackAction =
  | { kind: 'hint'; message: string }
  | { kind: 'retry'; message: string }
  | { kind: 'explanation'; message: string }
  | { kind: 'advance'; message: string }

export function resolveFeedbackAction(
  activity: Activity,
  attempts: ActivityAttemptRecord[]
): FeedbackAction {
  const latestAttempt = attempts[attempts.length - 1]

  if (!latestAttempt) {
    return {
      kind: 'retry',
      message: 'Try the activity to see feedback.',
    }
  }

  if (!latestAttempt.correct) {
    if (attempts.length === 1 && activity.hint?.text) {
      return {
        kind: 'hint',
        message: activity.hint.text,
      }
    }

    if (attempts.length >= 3 && activity.explanation?.text) {
      return {
        kind: 'explanation',
        message: activity.explanation.text,
      }
    }

    return {
      kind: 'retry',
      message: 'Try again with a new approach.',
    }
  }

  return {
    kind: 'advance',
    message: 'Great job. Move to the next activity.',
  }
}
