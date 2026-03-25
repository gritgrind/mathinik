import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { normalizeContentPack } from '~/lib/models/app-models'
import { loadExampleStateStore } from '~/lib/state/store'
import {
  applySkillMasteryToStateStore,
  calculateSkillMasteryUpdate,
} from './mastery'

const lesson = normalizeContentPack(loadBundledContentPack()).lessons[0]

describe('skill mastery', () => {
  it('calculates mastery updates from lesson outcome', () => {
    if (!lesson) throw new Error('Expected lesson')

    expect(
      calculateSkillMasteryUpdate(
        lesson,
        {
          completed: true,
          earnedStars: 3,
          bestStars: 3,
          improvedOnReplay: true,
        },
        0.35
      )
    ).toEqual({
      skillId: 'g1-add-within-5',
      value: 0.7,
      status: 'approaching-mastery',
    })
  })

  it('persists mastery state by skill', () => {
    const state = applySkillMasteryToStateStore(
      loadExampleStateStore(),
      'child-ava',
      {
        skillId: 'g1-add-within-5',
        value: 0.9,
        status: 'mastered',
      },
      '2026-03-25T21:00:00.000Z'
    )

    expect(state.profiles[0]?.progress.skillMastery['g1-add-within-5']).toEqual(
      {
        value: 0.9,
        status: 'mastered',
        updatedAt: '2026-03-25T21:00:00.000Z',
      }
    )
  })
})
