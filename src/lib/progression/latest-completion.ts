import type { ChildProfile } from '~/lib/state/types'

export function getLatestCompletedLessonId(
  profile: ChildProfile | null
): string | null {
  if (!profile) {
    return null
  }

  const entries = Object.entries(profile.progress.lessonProgress)
    .filter(([, progress]) => progress.completed)
    .sort((left, right) => {
      const leftTime = left[1].lastPlayedAt ?? ''
      const rightTime = right[1].lastPlayedAt ?? ''
      return rightTime.localeCompare(leftTime)
    })

  return entries[0]?.[0] ?? null
}
