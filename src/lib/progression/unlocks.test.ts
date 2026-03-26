import { describe, expect, it } from 'vitest'
import {
  createContentRepository,
  loadBundledContentPack,
} from '~/lib/content/repository'
import { normalizeContentPack } from '~/lib/models/app-models'
import { loadExampleStateStore } from '~/lib/state/store'
import {
  applyUnlocksAndRewardsToStateStore,
  calculateUnlocksAndRewards,
} from './unlocks'

const repository = createContentRepository(loadBundledContentPack())
const completedLesson = normalizeContentPack(loadBundledContentPack())
  .lessons[0]

describe('unlock and reward logic', () => {
  it('evaluates unlock rules from lesson metadata', () => {
    if (!completedLesson) throw new Error('Expected lesson')

    const state = loadExampleStateStore()
    const readyState = {
      ...state,
      profiles: state.profiles.map((profile) => ({
        ...profile,
        progress: {
          ...profile.progress,
          unlockedLessonIds: [],
          completedLessonIds: ['g1-add-within-5-lesson-1'],
          lessonProgress: {
            ...profile.progress.lessonProgress,
            'g1-add-within-5-lesson-1': {
              attemptCount: 1,
              bestStars: 3 as const,
              completed: true,
              resumable: false,
            },
          },
          skillMastery: {
            'g1-add-within-5': {
              value: 0.8,
              status: 'approaching-mastery' as const,
            },
          },
        },
      })),
    }

    const result = calculateUnlocksAndRewards(
      repository,
      readyState,
      'child-ava',
      completedLesson,
      3
    )

    expect(result.unlockedLessonIds).toContain('g1-add-within-5-lesson-2')
    expect(result.grantedBadgeIds).toContain('starter-builder')
  })

  it('stores unlocked lessons and granted rewards', () => {
    const state = applyUnlocksAndRewardsToStateStore(
      loadExampleStateStore(),
      'child-ava',
      {
        unlockedLessonIds: ['g1-add-within-5-lesson-2'],
        grantedBadgeIds: ['starter-builder'],
        grantedMapNodeIds: ['grade-1-add-1'],
        totalStarsAdded: 2,
      },
      '2026-03-25T22:00:00.000Z'
    )

    expect(state.profiles[0]?.progress.unlockedLessonIds).toContain(
      'g1-add-within-5-lesson-2'
    )
    expect(state.profiles[0]?.progress.rewards.badgeIds).toContain(
      'starter-builder'
    )
    expect(state.profiles[0]?.progress.rewards.totalStars).toBe(5)
  })

  it('does not unlock gated lessons when mastery is below the requirement', () => {
    if (!completedLesson) throw new Error('Expected lesson')

    const state = loadExampleStateStore()
    const gatedState = {
      ...state,
      profiles: state.profiles.map((profile) => ({
        ...profile,
        progress: {
          ...profile.progress,
          unlockedLessonIds: [],
          completedLessonIds: ['g1-add-within-5-lesson-1'],
          lessonProgress: {
            ...profile.progress.lessonProgress,
            'g1-add-within-5-lesson-1': {
              attemptCount: 1,
              bestStars: 3 as const,
              completed: true,
              resumable: false,
            },
          },
          skillMastery: {
            'g1-add-within-5': {
              value: 0.2,
              status: 'practicing' as const,
            },
          },
        },
      })),
    }

    expect(
      calculateUnlocksAndRewards(
        repository,
        gatedState,
        'child-ava',
        completedLesson,
        3
      )
    ).toMatchObject({
      unlockedLessonIds: [],
      grantedBadgeIds: ['starter-builder'],
    })
  })

  it('returns an empty result when the profile does not exist', () => {
    if (!completedLesson) throw new Error('Expected lesson')

    expect(
      calculateUnlocksAndRewards(
        repository,
        loadExampleStateStore(),
        'child-missing',
        completedLesson,
        2
      )
    ).toEqual({
      unlockedLessonIds: [],
      grantedBadgeIds: [],
      grantedMapNodeIds: [],
      totalStarsAdded: 0,
    })
  })

  it('deduplicates rewards and unlocked lessons when applying repeated grants', () => {
    const state = applyUnlocksAndRewardsToStateStore(
      loadExampleStateStore(),
      'child-ava',
      {
        unlockedLessonIds: ['g1-add-within-5-lesson-2'],
        grantedBadgeIds: ['starter-builder'],
        grantedMapNodeIds: ['grade-1-add-1'],
        totalStarsAdded: 1,
      },
      '2026-03-25T22:05:00.000Z'
    )

    expect(state.profiles[0]?.progress.unlockedLessonIds).toEqual([
      'g1-add-within-5-lesson-1',
      'g1-add-within-5-lesson-2',
    ])
    expect(state.profiles[0]?.progress.rewards.badgeIds).toEqual([
      'starter-builder',
    ])
    expect(state.profiles[0]?.progress.rewards.mapNodeIds).toEqual([
      'grade-1-add-1',
    ])
    expect(state.profiles[0]?.progress.rewards.totalStars).toBe(4)
  })
})
