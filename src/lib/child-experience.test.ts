import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import {
  normalizeContentPack,
  normalizeStateStore,
} from '~/lib/models/app-models'
import { loadExampleStateStore } from '~/lib/state/store'
import { getNextRecommendedLesson, getResumeLesson } from './child-experience'

describe('child experience helpers', () => {
  it('finds the resumable lesson for the active profile', () => {
    const lessons = normalizeContentPack(loadBundledContentPack()).lessons
    const activeProfile = normalizeStateStore(
      loadExampleStateStore()
    ).activeProfile

    expect(getResumeLesson(activeProfile, lessons)?.id).toBe(
      'g1-add-within-5-lesson-2'
    )
  })

  it('chooses a next recommended lesson when a profile exists', () => {
    const lessons = normalizeContentPack(loadBundledContentPack()).lessons
    const activeProfile = normalizeStateStore(
      loadExampleStateStore()
    ).activeProfile

    expect(getNextRecommendedLesson(activeProfile, lessons)?.id).toBe(
      'g1-add-within-5-lesson-2'
    )
  })

  it('falls back to the first lesson when no resume or recommendation exists', () => {
    const lessons = normalizeContentPack(loadBundledContentPack()).lessons
    const activeProfile = normalizeStateStore(
      loadExampleStateStore()
    ).activeProfile

    if (!activeProfile) {
      throw new Error('Expected active profile')
    }

    expect(
      getNextRecommendedLesson(
        {
          ...activeProfile,
          resumableLessonId: null,
          recommendedLessonId: null,
          unlockedLessonIds: [],
          completedLessonIds: [],
        },
        lessons
      )?.id
    ).toBe('g1-add-within-5-lesson-1')
  })

  it('prefers an unlocked unfinished lesson when no explicit recommendation exists', () => {
    const lessons = normalizeContentPack(loadBundledContentPack()).lessons
    const activeProfile = normalizeStateStore(
      loadExampleStateStore()
    ).activeProfile

    if (!activeProfile) {
      throw new Error('Expected active profile')
    }

    expect(
      getNextRecommendedLesson(
        {
          ...activeProfile,
          resumableLessonId: null,
          recommendedLessonId: null,
          completedLessonIds: ['g1-add-within-5-lesson-1'],
          unlockedLessonIds: ['g1-add-within-5-lesson-2'],
        },
        lessons
      )?.id
    ).toBe('g1-add-within-5-lesson-2')
  })
})
