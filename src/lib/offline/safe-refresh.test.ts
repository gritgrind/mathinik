import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { loadExampleStateStore } from '~/lib/state/store'
import { preserveStateForContentPack } from './safe-refresh'

describe('preserveStateForContentPack', () => {
  it('clears invalid lesson references without wiping learner profiles', () => {
    const pack = loadBundledContentPack()
    const nextPack = {
      ...pack,
      grades: pack.grades.map((grade) => ({
        ...grade,
        skills: grade.skills.map((skill) => ({
          ...skill,
          lessons: skill.lessons.filter(
            (lesson) => lesson.id !== 'g1-add-within-5-lesson-2'
          ),
        })),
      })),
    }

    const nextState = preserveStateForContentPack(
      loadExampleStateStore(),
      nextPack,
      '2026-03-26T02:00:00.000Z'
    )

    expect(nextState.profiles[0]?.displayName).toBe('Ava')
    expect(nextState.profiles[0]?.progress.resume.resumable).toBe(false)
  })
})
