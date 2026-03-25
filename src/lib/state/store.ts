import exampleStateStoreJson from '../../../state/examples/local-state.example.json'
import type { StateStore, StateStoreLoadResult } from './types'
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
