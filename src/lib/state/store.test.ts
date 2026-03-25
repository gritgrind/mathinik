import { describe, expect, it } from 'vitest'
import {
  addProfileToStateStore,
  createChildProfile,
  createEmptyStateStore,
  createStatePersistence,
  loadExampleStateStore,
  STATE_STORE_KEY,
  setActiveProfileInStateStore,
  updateProfilePlacementInStateStore,
} from './store'
import { StateStoreValidationError } from './validate-state-store'

function createMemoryStorage(seed?: Record<string, string>) {
  const values = new Map(Object.entries(seed ?? {}))

  return {
    getItem(key: string) {
      return values.get(key) ?? null
    },
    setItem(key: string, value: string) {
      values.set(key, value)
    },
    removeItem(key: string) {
      values.delete(key)
    },
  }
}

describe('state persistence', () => {
  it('loads the example local state', () => {
    const state = loadExampleStateStore()

    expect(state.activeProfileId).toBe('child-ava')
    expect(state.profiles).toHaveLength(1)
    expect(state.profiles[0]?.progress.resume.resumable).toBe(true)
  })

  it('returns a safe empty store when storage is missing', () => {
    const persistence = createStatePersistence(createMemoryStorage(), {
      contentVersion: '2026.03.21',
      now: () => '2026-03-25T12:00:00.000Z',
    })

    expect(persistence.loadStateStore()).toEqual({
      state: createEmptyStateStore({
        contentVersion: '2026.03.21',
        now: '2026-03-25T12:00:00.000Z',
      }),
      source: 'empty',
    })
  })

  it('recovers safely from invalid state data', () => {
    const storage = createMemoryStorage({
      [STATE_STORE_KEY]: JSON.stringify({
        schemaVersion: '1.0.0',
        deviceId: 'broken-device',
        profiles: [{ id: 'missing-progress' }],
      }),
    })

    const persistence = createStatePersistence(storage, {
      now: () => '2026-03-25T12:00:00.000Z',
    })
    const result = persistence.loadStateStore()

    expect(result.source).toBe('invalid')
    expect(result.error).toBeInstanceOf(StateStoreValidationError)
    expect(result.state.profiles).toEqual([])
  })

  it('saves validated state through the persistence abstraction', () => {
    const storage = createMemoryStorage()
    const persistence = createStatePersistence(storage, {
      now: () => '2026-03-25T12:34:56.000Z',
    })
    const exampleState = loadExampleStateStore()

    const savedState = persistence.saveStateStore(exampleState)

    expect(savedState.updatedAt).toBe('2026-03-25T12:34:56.000Z')
    expect(persistence.loadStateStore().source).toBe('storage')
  })

  it('creates a local profile and makes it active in state', () => {
    const state = createEmptyStateStore()
    const profile = createChildProfile(
      {
        displayName: 'Milo',
        gradeStart: 2,
      },
      {
        now: '2026-03-25T09:15:00.000Z',
      }
    )

    const nextState = addProfileToStateStore(state, profile, {
      now: '2026-03-25T09:15:00.000Z',
    })

    expect(nextState.activeProfileId).toBe(profile.id)
    expect(nextState.profiles[0]).toMatchObject({
      displayName: 'Milo',
      gradeStart: 2,
    })
  })

  it('stores manual or placement onboarding recommendations safely', () => {
    const state = loadExampleStateStore()

    const placedState = updateProfilePlacementInStateStore(
      state,
      {
        profileId: 'child-ava',
        mode: 'placement',
        gradeStart: 1,
        recommendedGrade: 1,
        recommendedSkillId: 'g1-add-within-5',
        recommendedLessonId: 'g1-add-within-5-lesson-1',
        summary: 'Placement suggests starting with addition within 5.',
      },
      {
        now: '2026-03-25T10:00:00.000Z',
      }
    )

    expect(placedState.profiles[0]?.placement).toMatchObject({
      used: true,
      recommendedLessonId: 'g1-add-within-5-lesson-1',
    })

    const manualState = updateProfilePlacementInStateStore(
      placedState,
      {
        profileId: 'child-ava',
        mode: 'manual',
        gradeStart: 2,
        summary: 'Manual grade 2 starting point selected.',
      },
      {
        now: '2026-03-25T10:05:00.000Z',
      }
    )

    expect(manualState.profiles[0]).toMatchObject({
      gradeStart: 2,
      placement: {
        used: false,
        recommendedGrade: 2,
      },
    })
  })

  it('switches the active profile without mutating another profile state', () => {
    const firstProfile = createChildProfile(
      { displayName: 'Ava', gradeStart: 1 },
      { now: '2026-03-25T09:00:00.000Z' }
    )
    const secondProfile = createChildProfile(
      { displayName: 'Milo', gradeStart: 3 },
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

    const switchedState = setActiveProfileInStateStore(state, firstProfile.id, {
      now: '2026-03-25T09:06:00.000Z',
    })

    expect(switchedState.activeProfileId).toBe(firstProfile.id)
    expect(switchedState.profiles[1]).toMatchObject({
      displayName: 'Milo',
      gradeStart: 3,
    })
  })
})
