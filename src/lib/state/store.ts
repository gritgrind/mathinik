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

export type PlacementShellInput = {
  profileId: string
  mode: 'manual' | 'placement'
  gradeStart: 1 | 2 | 3
  recommendedGrade?: 1 | 2 | 3
  recommendedSkillId?: string
  recommendedLessonId?: string
  summary?: string
}

export type LessonSessionStateInput = {
  profileId: string
  lessonId: string
  activityId?: string
  activityIndex: number
  resumable: boolean
  completed: boolean
}

export type ProfileAvatarInput = {
  profileId: string
  mascotStyle: string
  color: string
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

export function updateProfilePlacementInStateStore(
  state: StateStore,
  input: PlacementShellInput,
  options: { now?: string } = {}
): StateStore {
  const nextProfiles = state.profiles.map((profile) => {
    if (profile.id !== input.profileId) {
      return profile
    }

    return {
      ...profile,
      gradeStart: input.gradeStart,
      lastActiveAt: options.now ?? new Date().toISOString(),
      placement:
        input.mode === 'placement'
          ? {
              used: true,
              recommendedGrade: input.recommendedGrade ?? input.gradeStart,
              recommendedSkillId: input.recommendedSkillId,
              recommendedLessonId: input.recommendedLessonId,
              summary:
                input.summary ??
                'Placement shell recommendation saved locally.',
            }
          : {
              used: false,
              recommendedGrade: input.gradeStart,
              summary: input.summary ?? 'Manual starting grade selected.',
            },
    }
  })

  return parseStateStore({
    ...state,
    activeProfileId: input.profileId,
    updatedAt: options.now ?? new Date().toISOString(),
    profiles: nextProfiles,
  })
}

export function setActiveProfileInStateStore(
  state: StateStore,
  profileId: string,
  options: { now?: string } = {}
): StateStore {
  const nextProfiles = state.profiles.map((profile) =>
    profile.id === profileId
      ? {
          ...profile,
          lastActiveAt: options.now ?? new Date().toISOString(),
        }
      : profile
  )

  return parseStateStore({
    ...state,
    activeProfileId: profileId,
    updatedAt: options.now ?? new Date().toISOString(),
    profiles: nextProfiles,
  })
}

export function updateLessonSessionStateInStateStore(
  state: StateStore,
  input: LessonSessionStateInput,
  options: { incrementAttempt?: boolean; now?: string } = {}
): StateStore {
  const now = options.now ?? new Date().toISOString()

  const nextProfiles = state.profiles.map((profile) => {
    if (profile.id !== input.profileId) {
      return profile
    }

    const existingLessonProgress = profile.progress.lessonProgress[
      input.lessonId
    ] ?? {
      attemptCount: 0,
      bestStars: 0,
      completed: false,
      resumable: false,
    }

    const lessonProgress = {
      ...profile.progress.lessonProgress,
      [input.lessonId]: {
        ...existingLessonProgress,
        attemptCount:
          existingLessonProgress.attemptCount +
          (options.incrementAttempt ? 1 : 0),
        completed: input.completed,
        resumable: input.resumable,
        lastActivityIndex: input.activityIndex,
        lastActivityId: input.activityId,
        lastPlayedAt: now,
      },
    }

    const completedLessonIds = input.completed
      ? Array.from(
          new Set([...profile.progress.completedLessonIds, input.lessonId])
        )
      : profile.progress.completedLessonIds.filter(
          (lessonId) => lessonId !== input.lessonId
        )

    return {
      ...profile,
      lastActiveAt: now,
      progress: {
        ...profile.progress,
        lessonProgress,
        completedLessonIds,
        resume: input.resumable
          ? {
              lessonId: input.lessonId,
              activityId: input.activityId,
              activityIndex: input.activityIndex,
              resumable: true,
              updatedAt: now,
            }
          : {
              resumable: false,
              updatedAt: now,
            },
      },
    }
  })

  return parseStateStore({
    ...state,
    activeProfileId: input.profileId,
    updatedAt: now,
    profiles: nextProfiles,
  })
}

export function updateProfileAvatarInStateStore(
  state: StateStore,
  input: ProfileAvatarInput,
  now = new Date().toISOString()
): StateStore {
  return parseStateStore({
    ...state,
    activeProfileId: input.profileId,
    updatedAt: now,
    profiles: state.profiles.map((profile) => {
      if (profile.id !== input.profileId) {
        return profile
      }

      return {
        ...profile,
        lastActiveAt: now,
        avatar: {
          mascotStyle: input.mascotStyle,
          color: input.color,
        },
      }
    }),
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
