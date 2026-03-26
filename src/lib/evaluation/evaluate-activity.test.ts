import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import type { Activity } from '~/lib/content/types'
import { evaluateActivity } from './evaluate-activity'

const lessonActivities =
  loadBundledContentPack().grades[0]?.skills[0]?.lessons[0]?.activities ?? []

describe('evaluateActivity', () => {
  it('interprets exact-match equation builder attempts', () => {
    const activity = lessonActivities.find(
      (entry) => entry.type === 'equation-builder'
    )

    if (!activity) {
      throw new Error('Expected equation-builder activity')
    }

    expect(
      evaluateActivity(activity, {
        kind: 'equation-builder',
        left: ['n2', 'plus', 'n1'],
        right: ['equals', 'n3'],
      })
    ).toEqual({ correct: true, successMode: 'exact-match' })
  })

  it('rejects wrong or mismatched exact-match attempts', () => {
    const activity = lessonActivities.find(
      (entry) => entry.type === 'equation-builder'
    )

    if (!activity) {
      throw new Error('Expected equation-builder activity')
    }

    expect(
      evaluateActivity(activity, {
        kind: 'equation-builder',
        left: ['n1', 'plus', 'n1'],
        right: ['equals', 'n3'],
      })
    ).toEqual({ correct: false, successMode: 'exact-match' })

    expect(
      evaluateActivity(activity, {
        kind: 'multiple-choice',
        selectedChoiceIds: ['b'],
      })
    ).toEqual({ correct: false, successMode: 'exact-match' })
  })

  it('interprets set-match object manipulation attempts', () => {
    const activity = lessonActivities.find(
      (entry) => entry.type === 'object-manipulation'
    )

    if (!activity) {
      throw new Error('Expected object-manipulation activity')
    }

    expect(
      evaluateActivity(activity, {
        kind: 'object-manipulation',
        groupCounts: [2, 1],
        totalCount: 3,
      })
    ).toEqual({ correct: true, successMode: 'set-match' })
  })

  it('supports count-based set-match answers regardless of grouping', () => {
    const activity: Activity = {
      id: 'count-only-1',
      type: 'object-manipulation',
      prompt: 'Move four apples anywhere.',
      difficulty: 'easy',
      success: { mode: 'set-match', stars: 1 },
      content: {
        kind: 'object-manipulation',
        task: 'Move four apples into the scene.',
        scene: {
          objects: [{ id: 'apple', kind: 'apple', count: 4 }],
        },
        validAnswers: [{ expectedCount: 4 }],
      },
    }

    expect(
      evaluateActivity(activity, {
        kind: 'object-manipulation',
        groupCounts: [3, 1],
        totalCount: 4,
      })
    ).toEqual({ correct: true, successMode: 'set-match' })
  })

  it('interprets support activity results', () => {
    const choiceActivity = lessonActivities.find(
      (entry) => entry.type === 'multiple-choice'
    )

    if (!choiceActivity) {
      throw new Error('Expected multiple-choice activity')
    }

    expect(
      evaluateActivity(choiceActivity, {
        kind: 'multiple-choice',
        selectedChoiceIds: ['b'],
      })
    ).toEqual({ correct: true, successMode: 'choice-match' })

    expect(
      evaluateActivity(
        {
          id: 'numeric-check-1',
          type: 'numeric-input',
          prompt: 'How many apples are there?',
          difficulty: 'easy',
          success: { mode: 'numeric-match', stars: 1 },
          content: {
            kind: 'numeric-input',
            acceptedAnswers: [3],
          },
        },
        {
          kind: 'numeric-input',
          value: '3',
        }
      )
    ).toEqual({ correct: true, successMode: 'numeric-match' })
  })

  it('normalizes support answers and rejects mismatched support attempts', () => {
    const numericActivity: Activity = {
      id: 'numeric-check-2',
      type: 'numeric-input',
      prompt: 'Type the word answer.',
      difficulty: 'easy',
      success: { mode: 'numeric-match', stars: 1 },
      content: {
        kind: 'numeric-input',
        acceptedAnswers: ['three'],
      },
    }

    const multipleChoiceActivity = lessonActivities.find(
      (entry) => entry.type === 'multiple-choice'
    )

    if (!multipleChoiceActivity) {
      throw new Error('Expected multiple-choice activity')
    }

    expect(
      evaluateActivity(numericActivity, {
        kind: 'numeric-input',
        value: ' three ',
      })
    ).toEqual({ correct: true, successMode: 'numeric-match' })

    expect(
      evaluateActivity(multipleChoiceActivity, {
        kind: 'numeric-input',
        value: '3',
      })
    ).toEqual({ correct: false, successMode: 'choice-match' })
  })
})
