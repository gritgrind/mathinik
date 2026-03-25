import type { LessonModel } from '~/lib/models/app-models'
import type { ChildProfile } from '~/lib/state/types'

export type LessonMapItem = {
  id: string
  title: string
  gradeNumber: number
  state: 'locked' | 'next' | 'completed'
}

export function getLessonMapItems(
  lessons: LessonModel[],
  profile: ChildProfile | null
): LessonMapItem[] {
  return lessons.map((lesson, index) => {
    const completed =
      profile?.progress.completedLessonIds.includes(lesson.id) ?? false
    const unlocked =
      completed ||
      profile?.progress.unlockedLessonIds.includes(lesson.id) ||
      index === 0 ||
      false

    const state = completed
      ? 'completed'
      : profile?.placement?.recommendedLessonId === lesson.id || unlocked
        ? 'next'
        : 'locked'

    return {
      id: lesson.id,
      title: lesson.title,
      gradeNumber: lesson.gradeNumber,
      state,
    }
  })
}
