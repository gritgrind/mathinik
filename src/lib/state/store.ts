import exampleStateStoreJson from '../../../state/examples/local-state.example.json'
import type {
  ChildProfile,
  LearnerProgress,
  StateStore,
  StateStoreLoadResult,
} from './types'
import {
  parseStateStore,
  StateStoreValidationError,
} from './validate-state-store'

export const STATE_STORE_KEY = 'mathinik.state-store'
export const STATE_SCHEMA_VERSION = '1.0.0'

export type StorageLike = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>

export type StatePersistence = {
  loadStateStore: () => StateStoreLoadResult
  saveStateStore: (state: StateStore) => StateStore
  clearStateStore: () => void
}

export type CreateProfileInput = {
  displayName: string
  gradeStart: 1 | 2 | 3
}

export function createEmptyStateStore(
  options: { contentVersion?: string; deviceId?: string; now?: string } = {}
): StateStore {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    deviceId: options.deviceId ?? 'device-local-default',
    ...(options.contentVersion
      ? { contentVersion: options.contentVersion }
      : {}),
    ...(options.now ? { updatedAt: options.now } : {}),
    profiles: [],
  }
}

export function loadExampleStateStore(): StateStore {
  return parseStateStore(exampleStateStoreJson)
}

export function createEmptyProgress(): LearnerProgress {
  return {
    unlockedLessonIds: [],
    completedLessonIds: [],
    lessonProgress: {},
    skillMastery: {},
    rewards: {
      totalStars: 0,
      badgeIds: [],
      mapNodeIds: [],
    },
    resume: {
      resumable: false,
    },
  }
}

export function createChildProfile(
  input: CreateProfileInput,
  options: { now?: string } = {}
): ChildProfile {
  const trimmedName = input.displayName.trim()

  if (!trimmedName) {
    throw new Error('Display name is required')
  }

  const createdAt = options.now ?? new Date().toISOString()

  return {
    id: buildProfileId(trimmedName, createdAt),
    displayName: trimmedName,
    gradeStart: input.gradeStart,
    createdAt,
    lastActiveAt: createdAt,
    progress: createEmptyProgress(),
  }
}

export function addProfileToStateStore(
  state: StateStore,
  profile: ChildProfile,
  options: { now?: string } = {}
): StateStore {
  if (
    state.profiles.some((existingProfile) => existingProfile.id === profile.id)
  ) {
    throw new Error(`Profile ${profile.id} already exists`)
  }

  return parseStateStore({
    ...state,
    activeProfileId: profile.id,
    updatedAt: options.now ?? new Date().toISOString(),
    profiles: [...state.profiles, profile],
  })
}

export function createStatePersistence(
  storage: StorageLike,
  options: {
    contentVersion?: string
    key?: string
    now?: () => string
  } = {}
): StatePersistence {
  const storageKey = options.key ?? STATE_STORE_KEY
  const getNow = options.now ?? (() => new Date().toISOString())

  return {
    loadStateStore() {
      const raw = storage.getItem(storageKey)

      if (!raw) {
        return {
          state: createEmptyStateStore({
            contentVersion: options.contentVersion,
            now: getNow(),
          }),
          source: 'empty',
        }
      }

      try {
        const parsed = JSON.parse(raw)

        return {
          state: parseStateStore(parsed),
          source: 'storage',
        }
      } catch (error) {
        return {
          state: createEmptyStateStore({
            contentVersion: options.contentVersion,
            now: getNow(),
          }),
          source: 'invalid',
          error: toStatePersistenceError(error),
        }
      }
    },

    saveStateStore(state) {
      const nextState = parseStateStore({
        ...state,
        updatedAt: getNow(),
      })

      storage.setItem(storageKey, JSON.stringify(nextState))
      return nextState
    },

    clearStateStore() {
      storage.removeItem(storageKey)
    },
  }
}

export function createBrowserStatePersistence(
  options: { contentVersion?: string; key?: string; now?: () => string } = {}
): StatePersistence {
  if (typeof window === 'undefined') {
    throw new Error('Browser state persistence requires window.localStorage')
  }

  return createStatePersistence(window.localStorage, options)
}

function toStatePersistenceError(error: unknown): Error {
  if (error instanceof StateStoreValidationError) {
    return error
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('Unknown state persistence failure')
}

function buildProfileId(displayName: string, createdAt: string): string {
  const slug = displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const timeSuffix = createdAt.replace(/[^0-9]/g, '').slice(-8)
  return `child-${slug || 'learner'}-${timeSuffix}`
}
