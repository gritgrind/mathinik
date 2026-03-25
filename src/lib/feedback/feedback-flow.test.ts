import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { resolveFeedbackAction } from './feedback-flow'

const activities =
  loadBundledContentPack().grades[0]?.skills[0]?.lessons[0]?.activities ?? []

describe('resolveFeedbackAction', () => {
  it('shows a hint before explanation on early struggle', () => {
    const activity = activities.find((entry) => entry.id === 'combine-apples')

    if (!activity) throw new Error('Expected activity')

    expect(resolveFeedbackAction(activity, [{ correct: false }])).toEqual({
      kind: 'hint',
      message: 'Try counting each apple as you move it.',
    })
  })

  it('triggers a follow-up representation after first success when configured', () => {
    const activity = activities.find(
      (entry) => entry.id === 'build-equation-2-plus-1'
    )

    if (!activity) throw new Error('Expected activity')

    expect(resolveFeedbackAction(activity, [{ correct: true }])).toEqual({
      kind: 'follow-up',
      message: 'Now match the built equation to the right apple picture.',
    })
  })

  it('advances after follow-up is satisfied', () => {
    const activity = activities.find(
      (entry) => entry.id === 'build-equation-2-plus-1'
    )

    if (!activity) throw new Error('Expected activity')

    expect(
      resolveFeedbackAction(activity, [{ correct: true }], {
        followUpSatisfied: true,
      })
    ).toEqual({
      kind: 'advance',
      message: 'Great job. Move to the next activity.',
    })
  })
})
