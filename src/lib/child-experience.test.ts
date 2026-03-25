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
      'g1-add-within-5-lesson-1'
    )
  })
})
