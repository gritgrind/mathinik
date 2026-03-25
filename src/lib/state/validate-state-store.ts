import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import stateSchema from '../../../schemas/mathinik-state.schema.json'
import type { StateStore } from './types'

const ajv = new Ajv2020({ allErrors: true, strict: false })
addFormats(ajv)

const validateStateStore = ajv.compile<StateStore>(stateSchema)

export class StateStoreValidationError extends Error {
  issues: string[]

  constructor(issues: string[]) {
    super(`Invalid Mathinik state store: ${issues.join('; ')}`)
    this.name = 'StateStoreValidationError'
    this.issues = issues
  }
}

export function parseStateStore(input: unknown): StateStore {
  if (validateStateStore(input)) {
    return input
  }

  const issues = validateStateStore.errors?.map((error) => {
    const path = error.instancePath || '/'
    return `${path} ${error.message ?? 'is invalid'}`
  }) ?? ['Unknown validation failure']

  throw new StateStoreValidationError(issues)
}
