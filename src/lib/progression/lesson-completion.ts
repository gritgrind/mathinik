import type { Activity } from '~/lib/content/types'
import type { ActivityAttemptRecord } from '~/lib/feedback/feedback-flow'
import type { LessonSession } from '~/lib/lesson/session-runner'
import type { StateStore } from '~/lib/state/types'

export type LessonCompletionOutcome = {
  completed: boolean
  earnedStars: 0 | 1 | 2 | 3
  bestStars: 0 | 1 | 2 | 3
  improvedOnReplay: boolean
}

export function calculateLessonCompletion(
  activities: Activity[],
  attemptsByActivityId: Record<string, ActivityAttemptRecord[]>,
  previousBestStars: 0 | 1 | 2 | 3 = 0
): LessonCompletionOutcome {
  const totalPossibleStars = activities.reduce(
    (sum, activity) => sum + activity.success.stars,
    0
  )

  const earnedActivityStars = activities.map((activity) => {
    const attempts = attemptsByActivityId[activity.id] ?? []
    const firstCorrectIndex = attempts.findIndex((attempt) => attempt.correct)

    if (firstCorrectIndex === -1) {
      return 0
    }

    return Math.max(1, activity.success.stars - firstCorrectIndex)
  })

  const earnedStars = normalizeStars(
    earnedActivityStars.reduce((sum, stars) => sum + stars, 0),
    totalPossibleStars
  )
  const completed = activities.every((activity) =>
    (attemptsByActivityId[activity.id] ?? []).some((attempt) => attempt.correct)
  )
  const bestStars = Math.max(previousBestStars, earnedStars) as 0 | 1 | 2 | 3

  return {
    completed,
    earnedStars,
    bestStars,
    improvedOnReplay: bestStars > previousBestStars,
  }
}

export function applyLessonCompletionToStateStore(
  state: StateStore,
  session: LessonSession,
  outcome: LessonCompletionOutcome,
  now = new Date().toISOString()
): StateStore {
  return {
    ...state,
    updatedAt: now,
    profiles: state.profiles.map((profile) => {
      if (profile.id !== session.profileId) {
        return profile
      }

      const previousProgress = profile.progress.lessonProgress[session.lessonId]

      return {
        ...profile,
        lastActiveAt: now,
        progress: {
          ...profile.progress,
          completedLessonIds: outcome.completed
            ? Array.from(
                new Set([
                  ...profile.progress.completedLessonIds,
                  session.lessonId,
                ])
              )
            : profile.progress.completedLessonIds,
          lessonProgress: {
            ...profile.progress.lessonProgress,
            [session.lessonId]: {
              ...previousProgress,
              attemptCount: previousProgress?.attemptCount ?? 1,
              bestStars: outcome.bestStars,
              completed: outcome.completed,
              resumable: false,
              lastActivityIndex: session.currentActivityIndex,
              lastActivityId:
                session.activityIds[session.activityIds.length - 1] ??
                previousProgress?.lastActivityId,
              lastPlayedAt: now,
              improvedOnReplay: outcome.improvedOnReplay,
            },
          },
          resume: {
            resumable: false,
            updatedAt: now,
          },
        },
      }
    }),
  }
}

function normalizeStars(
  earnedStars: number,
  totalPossibleStars: number
): 0 | 1 | 2 | 3 {
  if (totalPossibleStars <= 0 || earnedStars <= 0) {
    return 0
  }

  const ratio = earnedStars / totalPossibleStars

  if (ratio >= 0.85) return 3
  if (ratio >= 0.6) return 2
  return 1
}
