import type { ContentPack } from '~/lib/content/types'
import type { StateStore } from '~/lib/state/types'

export function preserveStateForContentPack(
  state: StateStore,
  pack: ContentPack,
  now = new Date().toISOString()
): StateStore {
  const validLessonIds = new Set(
    pack.grades.flatMap((grade) =>
      grade.skills.flatMap((skill) => skill.lessons.map((lesson) => lesson.id))
    )
  )
  const validActivityIdsByLessonId = new Map(
    pack.grades.flatMap((grade) =>
      grade.skills.flatMap((skill) =>
        skill.lessons.map((lesson) => [
          lesson.id,
          new Set(lesson.activities.map((activity) => activity.id)),
        ])
      )
    )
  )

  return {
    ...state,
    updatedAt: now,
    profiles: state.profiles.map((profile) => {
      const resumeLessonId = profile.progress.resume.lessonId
      const resumeActivityId = profile.progress.resume.activityId
      const resumeValid =
        (!resumeLessonId || validLessonIds.has(resumeLessonId)) &&
        (!resumeLessonId ||
          !resumeActivityId ||
          validActivityIdsByLessonId.get(resumeLessonId)?.has(resumeActivityId))

      return {
        ...profile,
        placement:
          profile.placement?.recommendedLessonId &&
          !validLessonIds.has(profile.placement.recommendedLessonId)
            ? {
                ...profile.placement,
                recommendedLessonId: undefined,
                summary:
                  'The saved lesson recommendation was cleared safely after a content refresh.',
              }
            : profile.placement,
        progress: {
          ...profile.progress,
          unlockedLessonIds: profile.progress.unlockedLessonIds.filter(
            (lessonId) => validLessonIds.has(lessonId)
          ),
          completedLessonIds: profile.progress.completedLessonIds.filter(
            (lessonId) => validLessonIds.has(lessonId)
          ),
          lessonProgress: Object.fromEntries(
            Object.entries(profile.progress.lessonProgress).filter(
              ([lessonId]) => validLessonIds.has(lessonId)
            )
          ),
          resume: resumeValid
            ? profile.progress.resume
            : {
                resumable: false,
                updatedAt: now,
              },
        },
      }
    }),
  }
}
