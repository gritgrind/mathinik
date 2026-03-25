import { describe, expect, it } from 'vitest'
import { loadExampleStateStore } from '~/lib/state/store'
import { getLatestCompletedLessonId } from './latest-completion'

describe('latest completion', () => {
  it('returns the most recently completed lesson id', () => {
    const profile = loadExampleStateStore().profiles[0]

    if (!profile) throw new Error('Expected profile')

    const lessonId = getLatestCompletedLessonId({
      ...profile,
      progress: {
        ...profile.progress,
        lessonProgress: {
          'g1-add-within-5-lesson-1': {
            attemptCount: 1,
            bestStars: 3,
            completed: true,
            resumable: false,
            lastPlayedAt: '2026-03-25T22:00:00.000Z',
          },
          'g1-add-within-5-lesson-2': {
            attemptCount: 1,
            bestStars: 2,
            completed: true,
            resumable: false,
            lastPlayedAt: '2026-03-25T23:00:00.000Z',
          },
        },
      },
    })

    expect(lessonId).toBe('g1-add-within-5-lesson-2')
  })
})
