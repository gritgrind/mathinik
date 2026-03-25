import { describe, expect, it } from 'vitest'
import {
  createContentRepository,
  getBundledContentRepository,
  loadBundledContentPack,
} from './repository'
import {
  ContentPackValidationError,
  parseContentPack,
} from './validate-content-pack'

describe('content repository', () => {
  it('loads the bundled example content pack', () => {
    const repository = getBundledContentRepository()

    expect(repository.getContentVersion()).toBe('2026.03.21')
    expect(repository.getSummary()).toMatchObject({
      gradeCount: 1,
      skillCount: 1,
      lessonCount: 2,
      activityCount: 5,
    })
    expect(repository.getLesson('g1-add-within-5-lesson-1')?.title).toBe(
      'Build Groups and Equations'
    )
  })

  it('indexes activities by lesson and activity id', () => {
    const repository = createContentRepository(loadBundledContentPack())

    expect(
      repository.getActivity('g1-add-within-5-lesson-1', 'combine-apples')?.type
    ).toBe('object-manipulation')
  })

  it('fails clearly when content validation fails', () => {
    expect(() =>
      parseContentPack({
        schemaVersion: '1.0.0',
        packId: 'broken-pack',
        title: 'Broken pack',
        version: '2026.03.25',
        grades: [],
      })
    ).toThrow(ContentPackValidationError)

    expect(() =>
      parseContentPack({
        schemaVersion: '1.0.0',
        packId: 'broken-pack',
        title: 'Broken pack',
        version: '2026.03.25',
        grades: [],
      })
    ).toThrow(/Invalid Mathinik content pack/)
  })
})
