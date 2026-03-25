import Ajv2020 from 'ajv/dist/2020'
import addFormats from 'ajv-formats'
import contentSchema from '../../../schemas/mathinik-content.schema.json'
import type { ContentPack } from './types'

const ajv = new Ajv2020({ allErrors: true, strict: false })
addFormats(ajv)

const validateContentPack = ajv.compile<ContentPack>(contentSchema)

export class ContentPackValidationError extends Error {
  issues: string[]

  constructor(issues: string[]) {
    super(`Invalid Mathinik content pack: ${issues.join('; ')}`)
    this.name = 'ContentPackValidationError'
    this.issues = issues
  }
}

export function parseContentPack(input: unknown): ContentPack {
  if (validateContentPack(input)) {
    return input
  }

  const issues = validateContentPack.errors?.map((error) => {
    const path = error.instancePath || '/'
    return `${path} ${error.message ?? 'is invalid'}`
  }) ?? ['Unknown validation failure']

  throw new ContentPackValidationError(issues)
}
