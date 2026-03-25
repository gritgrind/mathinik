import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { normalizeContentPack } from '~/lib/models/app-models'
import { loadExampleStateStore } from '~/lib/state/store'
import { getLessonMapItems } from './map-progress'

describe('lesson map items', () => {
  it('marks completed, next, and locked lessons from learner state', () => {
    const lessons = normalizeContentPack(loadBundledContentPack()).lessons
    const profile = loadExampleStateStore().profiles[0]

    if (!profile) throw new Error('Expected profile')

    const items = getLessonMapItems(lessons, {
      ...profile,
      progress: {
        ...profile.progress,
        completedLessonIds: ['g1-add-within-5-lesson-1'],
        unlockedLessonIds: ['g1-add-within-5-lesson-2'],
      },
      placement: {
        recommendedLessonId: 'g1-add-within-5-lesson-2',
      },
    })

    expect(items[0]?.state).toBe('completed')
    expect(items[1]?.state).toBe('next')
  })
})
