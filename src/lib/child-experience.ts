import type { LessonModel, ProfileModel } from '~/lib/models/app-models'

export function getResumeLesson(
  profile: ProfileModel | null,
  lessons: LessonModel[]
): LessonModel | null {
  if (!profile?.resumableLessonId) {
    return null
  }

  return (
    lessons.find((lesson) => lesson.id === profile.resumableLessonId) ?? null
  )
}

export function getNextRecommendedLesson(
  profile: ProfileModel | null,
  lessons: LessonModel[]
): LessonModel | null {
  if (!profile) {
    return lessons[0] ?? null
  }

  if (profile.resumableLessonId) {
    const resumableLesson = lessons.find(
      (lesson) => lesson.id === profile.resumableLessonId
    )

    if (resumableLesson) {
      return resumableLesson
    }
  }

  if (profile.recommendedLessonId) {
    const recommendedLesson = lessons.find(
      (lesson) => lesson.id === profile.recommendedLessonId
    )

    if (recommendedLesson) {
      return recommendedLesson
    }
  }

  const nextUnlockedLesson = lessons.find(
    (lesson) =>
      profile.unlockedLessonIds.includes(lesson.id) &&
      !profile.completedLessonIds.includes(lesson.id)
  )

  if (nextUnlockedLesson) {
    return nextUnlockedLesson
  }

  return lessons[0] ?? null
}
