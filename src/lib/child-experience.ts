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

  const unlockedLessons = lessons.filter((lesson) =>
    profile.recommendedLessonId
      ? lesson.id === profile.recommendedLessonId || true
      : true
  )

  const unfinishedUnlockedLesson = unlockedLessons.find(
    (lesson) =>
      !profile.resumableLessonId || lesson.id !== profile.resumableLessonId
  )

  return unfinishedUnlockedLesson ?? lessons[0] ?? null
}
