import type { ContentRepository } from '~/lib/content/repository'
import type { ChildProfile } from '~/lib/state/types'

export type ParentSummaryModel = {
  childName: string
  completedLessons: Array<{
    lessonId: string
    title: string
    bestStars: 0 | 1 | 2 | 3
    lastPlayedAt: string | null
  }>
  mastery: Array<{
    skillId: string
    title: string
    value: number
    status: 'not-started' | 'practicing' | 'approaching-mastery' | 'mastered'
  }>
  rewards: {
    totalStars: number
    badgeIds: string[]
    mapNodeIds: string[]
  }
  recentActivity: {
    type: 'resume' | 'latest-completion' | 'none'
    lessonTitle: string | null
    activityId: string | null
  }
}

export function getParentSummaryModel(
  profile: ChildProfile | null,
  repository: ContentRepository
): ParentSummaryModel | null {
  if (!profile) {
    return null
  }

  const completedLessons = profile.progress.completedLessonIds
    .map((lessonId) => {
      const lesson = repository.getLesson(lessonId)
      const lessonProgress = profile.progress.lessonProgress[lessonId]

      if (!lesson || !lessonProgress) {
        return null
      }

      return {
        lessonId,
        title: lesson.title,
        bestStars: lessonProgress.bestStars,
        lastPlayedAt: lessonProgress.lastPlayedAt ?? null,
      }
    })
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson))
    .sort((left, right) =>
      (right.lastPlayedAt ?? '').localeCompare(left.lastPlayedAt ?? '')
    )

  const mastery = Object.entries(profile.progress.skillMastery)
    .map(([skillId, record]) => {
      const skill = repository.getSkill(skillId)

      return {
        skillId,
        title: skill?.title ?? skillId,
        value: record.value,
        status: record.status,
      }
    })
    .sort((left, right) => right.value - left.value)

  const resumableLesson = profile.progress.resume.lessonId
    ? repository.getLesson(profile.progress.resume.lessonId)
    : null
  const latestCompletedLesson = completedLessons[0]

  return {
    childName: profile.displayName,
    completedLessons,
    mastery,
    rewards: {
      totalStars: profile.progress.rewards.totalStars,
      badgeIds: profile.progress.rewards.badgeIds,
      mapNodeIds: profile.progress.rewards.mapNodeIds,
    },
    recentActivity: resumableLesson
      ? {
          type: 'resume',
          lessonTitle: resumableLesson.title,
          activityId: profile.progress.resume.activityId ?? null,
        }
      : latestCompletedLesson
        ? {
            type: 'latest-completion',
            lessonTitle: latestCompletedLesson.title,
            activityId: null,
          }
        : {
            type: 'none',
            lessonTitle: null,
            activityId: null,
          },
  }
}
