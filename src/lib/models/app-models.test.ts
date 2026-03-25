import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { loadExampleStateStore } from '~/lib/state/store'
import { normalizeContentPack, normalizeStateStore } from './app-models'

describe('app model normalization', () => {
  it('normalizes lessons and activities for app-facing access', () => {
    const models = normalizeContentPack(loadBundledContentPack())

    expect(models.lessons).toHaveLength(2)
    expect(models.lessonsById.get('g1-add-within-5-lesson-1')).toMatchObject({
      gradeNumber: 1,
      skillId: 'g1-add-within-5',
      activityCount: 3,
    })
    expect(
      models.activitiesByLessonId.get('g1-add-within-5-lesson-1')
    ).toHaveLength(3)
  })

  it('normalizes profile state for app-facing access', () => {
    const models = normalizeStateStore(loadExampleStateStore())

    expect(models.activeProfile).toMatchObject({
      id: 'child-ava',
      unlockedLessonCount: 2,
      completedLessonCount: 1,
      totalStars: 3,
      resumableLessonId: 'g1-add-within-5-lesson-2',
    })
  })
})
