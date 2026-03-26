import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { normalizeContentPack } from '~/lib/models/app-models'
import {
  addProfileToStateStore,
  createChildProfile,
  createEmptyStateStore,
  loadExampleStateStore,
} from '~/lib/state/store'
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

  it('caps mastery at one and updates status thresholds', () => {
    if (!lesson) throw new Error('Expected lesson')

    expect(
      calculateSkillMasteryUpdate(
        lesson,
        {
          completed: true,
          earnedStars: 3,
          bestStars: 3,
          improvedOnReplay: false,
        },
        0.9
      )
    ).toEqual({
      skillId: 'g1-add-within-5',
      value: 1,
      status: 'mastered',
    })

    expect(
      calculateSkillMasteryUpdate(
        lesson,
        {
          completed: true,
          earnedStars: 1,
          bestStars: 1,
          improvedOnReplay: false,
        },
        0
      )
    ).toEqual({
      skillId: 'g1-add-within-5',
      value: 0.12,
      status: 'practicing',
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

  it('only updates the targeted profile mastery record', () => {
    const firstProfile = createChildProfile(
      { displayName: 'Ava', gradeStart: 1 },
      { now: '2026-03-25T09:00:00.000Z' }
    )
    const secondProfile = createChildProfile(
      { displayName: 'Milo', gradeStart: 2 },
      { now: '2026-03-25T09:05:00.000Z' }
    )
    const state = addProfileToStateStore(
      addProfileToStateStore(createEmptyStateStore(), firstProfile, {
        now: '2026-03-25T09:00:00.000Z',
      }),
      secondProfile,
      {
        now: '2026-03-25T09:05:00.000Z',
      }
    )

    const nextState = applySkillMasteryToStateStore(
      state,
      secondProfile.id,
      {
        skillId: 'g1-add-within-5',
        value: 0.4,
        status: 'practicing',
      },
      '2026-03-25T21:15:00.000Z'
    )

    expect(nextState.profiles[0]?.progress.skillMastery).toEqual({})
    expect(
      nextState.profiles[1]?.progress.skillMastery['g1-add-within-5']
    ).toMatchObject({
      value: 0.4,
      status: 'practicing',
    })
  })
})
