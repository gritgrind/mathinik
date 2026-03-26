import type { ContentPack } from '~/lib/content/types'
import type { StateStore } from '~/lib/state/types'

export type LessonModel = {
  id: string
  slug: string
  title: string
  goal: string
  estimatedMinutes: number | null
  gradeId: string
  gradeNumber: number
  gradeTitle: string
  skillId: string
  skillSlug: string
  skillTitle: string
  domain: string
  activityIds: string[]
  activityCount: number
}

export type ActivityModel = {
  id: string
  lessonId: string
  lessonTitle: string
  skillId: string
  gradeNumber: number
  type: string
  prompt: string
  difficulty: string
  hasHint: boolean
  hasExplanation: boolean
}

export type ProfileModel = {
  id: string
  displayName: string
  gradeStart: number
  avatarLabel: string
  unlockedLessonIds: string[]
  completedLessonIds: string[]
  unlockedLessonCount: number
  completedLessonCount: number
  totalStars: number
  resumableLessonId: string | null
  resumableActivityId: string | null
  lastActiveAt: string | null
  placementUsed: boolean
  recommendedGrade: number | null
  recommendedSkillId: string | null
  recommendedLessonId: string | null
  placementSummary: string | null
}

export type NormalizedContentModels = {
  lessons: LessonModel[]
  activities: ActivityModel[]
  lessonsById: Map<string, LessonModel>
  activitiesByLessonId: Map<string, ActivityModel[]>
}

export type NormalizedStateModels = {
  profiles: ProfileModel[]
  profilesById: Map<string, ProfileModel>
  activeProfile: ProfileModel | null
}

export function normalizeContentPack(
  pack: ContentPack
): NormalizedContentModels {
  const lessons: LessonModel[] = []
  const activities: ActivityModel[] = []
  const lessonsById = new Map<string, LessonModel>()
  const activitiesByLessonId = new Map<string, ActivityModel[]>()

  for (const grade of pack.grades) {
    for (const skill of grade.skills) {
      for (const lesson of skill.lessons) {
        const lessonModel: LessonModel = {
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          goal: lesson.goal,
          estimatedMinutes: lesson.estimatedMinutes ?? null,
          gradeId: grade.id,
          gradeNumber: grade.grade,
          gradeTitle: grade.title,
          skillId: skill.id,
          skillSlug: skill.slug,
          skillTitle: skill.title,
          domain: skill.domain,
          activityIds: lesson.activities.map((activity) => activity.id),
          activityCount: lesson.activities.length,
        }

        lessons.push(lessonModel)
        lessonsById.set(lessonModel.id, lessonModel)

        const activityModels = lesson.activities.map((activity) => ({
          id: activity.id,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          skillId: skill.id,
          gradeNumber: grade.grade,
          type: activity.type,
          prompt: activity.prompt,
          difficulty: activity.difficulty,
          hasHint: Boolean(activity.hint),
          hasExplanation: Boolean(activity.explanation),
        }))

        activities.push(...activityModels)
        activitiesByLessonId.set(lesson.id, activityModels)
      }
    }
  }

  return {
    lessons,
    activities,
    lessonsById,
    activitiesByLessonId,
  }
}

export function normalizeStateStore(state: StateStore): NormalizedStateModels {
  const profiles = state.profiles.map((profile) => ({
    id: profile.id,
    displayName: profile.displayName,
    gradeStart: profile.gradeStart,
    avatarLabel: profile.avatar?.mascotStyle ?? 'default mascot',
    unlockedLessonIds: profile.progress.unlockedLessonIds,
    completedLessonIds: profile.progress.completedLessonIds,
    unlockedLessonCount: profile.progress.unlockedLessonIds.length,
    completedLessonCount: profile.progress.completedLessonIds.length,
    totalStars: profile.progress.rewards.totalStars,
    resumableLessonId: profile.progress.resume.lessonId ?? null,
    resumableActivityId: profile.progress.resume.activityId ?? null,
    lastActiveAt: profile.lastActiveAt ?? null,
    placementUsed: profile.placement?.used ?? false,
    recommendedGrade: profile.placement?.recommendedGrade ?? null,
    recommendedSkillId: profile.placement?.recommendedSkillId ?? null,
    recommendedLessonId: profile.placement?.recommendedLessonId ?? null,
    placementSummary: profile.placement?.summary ?? null,
  }))

  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]))

  return {
    profiles,
    profilesById,
    activeProfile:
      (state.activeProfileId
        ? profilesById.get(state.activeProfileId)
        : null) ??
      profiles[0] ??
      null,
  }
}
