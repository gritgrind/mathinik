import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { startLessonSession } from '~/lib/lesson/session-runner'
import { normalizeContentPack } from '~/lib/models/app-models'
import { loadExampleStateStore } from '~/lib/state/store'
import {
  applyLessonCompletionToStateStore,
  calculateLessonCompletion,
} from './lesson-completion'

const pack = loadBundledContentPack()
const lesson = pack.grades[0]?.skills[0]?.lessons[0]

describe('lesson completion', () => {
  it('calculates deterministic stars from activity attempts', () => {
    if (!lesson) throw new Error('Expected lesson')

    const outcome = calculateLessonCompletion(lesson.activities, {
      'combine-apples': [{ correct: false }, { correct: true }],
      'build-equation-2-plus-1': [{ correct: true }],
      'quick-check': [{ correct: true }],
    })

    expect(outcome).toEqual({
      completed: true,
      earnedStars: 2,
      bestStars: 2,
      improvedOnReplay: true,
    })
  })

  it('stores lesson completion and best stars', () => {
    if (!lesson) throw new Error('Expected lesson')

    const models = normalizeContentPack(pack)
    const lessonModel = models.lessonsById.get(lesson.id)
    const activities = models.activitiesByLessonId.get(lesson.id)

    if (!lessonModel || !activities) throw new Error('Expected models')

    const session = startLessonSession('child-ava', lessonModel, activities)
    const nextState = applyLessonCompletionToStateStore(
      loadExampleStateStore(),
      session,
      {
        completed: true,
        earnedStars: 2,
        bestStars: 3,
        improvedOnReplay: false,
      },
      '2026-03-25T20:00:00.000Z'
    )

    expect(
      nextState.profiles[0]?.progress.lessonProgress[lesson.id]
    ).toMatchObject({
      bestStars: 3,
      completed: true,
      resumable: false,
    })
  })
})
