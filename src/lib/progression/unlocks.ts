import type { ContentRepository } from '~/lib/content/repository'
import type { LessonModel } from '~/lib/models/app-models'
import type { StateStore } from '~/lib/state/types'

export type UnlockRewardResult = {
  unlockedLessonIds: string[]
  grantedBadgeIds: string[]
  grantedMapNodeIds: string[]
  totalStarsAdded: number
}

export function calculateUnlocksAndRewards(
  repository: ContentRepository,
  state: StateStore,
  profileId: string,
  completedLesson: LessonModel,
  earnedStars: 0 | 1 | 2 | 3
): UnlockRewardResult {
  const profile = state.profiles.find((entry) => entry.id === profileId)

  if (!profile) {
    return emptyResult()
  }

  const candidateLessons = repository
    .getGrades()
    .flatMap((grade) => grade.skills.flatMap((skill) => skill.lessons))
  const unlockedLessonIds = candidateLessons
    .filter((lesson) => lesson.id !== completedLesson.id)
    .filter((lesson) => !profile.progress.unlockedLessonIds.includes(lesson.id))
    .filter((lesson) => {
      const requiresLessonIds = lesson.unlock?.requiresLessonIds ?? []
      const minStars = lesson.unlock?.minStars ?? 0
      const minMastery = lesson.unlock?.minMastery ?? 0
      const bestStars =
        profile.progress.lessonProgress[completedLesson.id]?.bestStars ??
        earnedStars
      const masteryValue =
        profile.progress.skillMastery[completedLesson.skillId]?.value ?? 0

      return (
        requiresLessonIds.every((lessonId) =>
          profile.progress.completedLessonIds.includes(lessonId)
        ) &&
        bestStars >= minStars &&
        masteryValue >= minMastery
      )
    })
    .map((lesson) => lesson.id)

  const reward = repository.getLesson(completedLesson.id)?.reward

  return {
    unlockedLessonIds,
    grantedBadgeIds: reward?.badgeId ? [reward.badgeId] : [],
    grantedMapNodeIds: reward?.mapNodeId ? [reward.mapNodeId] : [],
    totalStarsAdded: earnedStars,
  }
}

export function applyUnlocksAndRewardsToStateStore(
  state: StateStore,
  profileId: string,
  result: UnlockRewardResult,
  now = new Date().toISOString()
): StateStore {
  return {
    ...state,
    updatedAt: now,
    profiles: state.profiles.map((profile) => {
      if (profile.id !== profileId) {
        return profile
      }

      return {
        ...profile,
        lastActiveAt: now,
        progress: {
          ...profile.progress,
          unlockedLessonIds: Array.from(
            new Set([
              ...profile.progress.unlockedLessonIds,
              ...result.unlockedLessonIds,
            ])
          ),
          rewards: {
            totalStars:
              profile.progress.rewards.totalStars + result.totalStarsAdded,
            badgeIds: Array.from(
              new Set([
                ...profile.progress.rewards.badgeIds,
                ...result.grantedBadgeIds,
              ])
            ),
            mapNodeIds: Array.from(
              new Set([
                ...profile.progress.rewards.mapNodeIds,
                ...result.grantedMapNodeIds,
              ])
            ),
          },
        },
      }
    }),
  }
}

function emptyResult(): UnlockRewardResult {
  return {
    unlockedLessonIds: [],
    grantedBadgeIds: [],
    grantedMapNodeIds: [],
    totalStarsAdded: 0,
  }
}
