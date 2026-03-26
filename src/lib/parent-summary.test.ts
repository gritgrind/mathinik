import { describe, expect, it } from 'vitest'
import { getBundledContentRepository } from '~/lib/content/repository'
import { loadExampleStateStore } from '~/lib/state/store'
import { getParentSummaryModel } from './parent-summary'

describe('getParentSummaryModel', () => {
  it('derives completed lessons, mastery, rewards, and resume context', () => {
    const repository = getBundledContentRepository()
    const profile = loadExampleStateStore().profiles[0]

    if (!profile) {
      throw new Error('Expected example profile')
    }

    const summary = getParentSummaryModel(profile, repository)

    expect(summary).toMatchObject({
      childName: 'Ava',
      rewards: {
        totalStars: 3,
      },
      recentActivity: {
        type: 'resume',
        lessonTitle: 'Show and Check Sums Within 5',
        activityId: 'build-equation-3-plus-1',
      },
    })
    expect(summary?.completedLessons[0]).toMatchObject({
      lessonId: 'g1-add-within-5-lesson-1',
      bestStars: 3,
    })
    expect(summary?.mastery[0]?.skillId).toBe('g1-add-within-5')
  })

  it('returns null when there is no profile', () => {
    expect(
      getParentSummaryModel(null, getBundledContentRepository())
    ).toBeNull()
  })
})
