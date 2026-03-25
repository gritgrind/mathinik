import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { ActivityRenderer } from './ActivityRenderer'

const exampleActivities =
  loadBundledContentPack().grades[0]?.skills[0]?.lessons[0]?.activities

describe('ActivityRenderer', () => {
  it('dispatches to a supported renderer by activity type', () => {
    const activity = exampleActivities?.[0]

    if (!activity) {
      throw new Error('Expected bundled example activity')
    }

    render(<ActivityRenderer activity={activity} />)

    expect(screen.getByText('Object manipulation')).toBeVisible()
    expect(screen.getByText(activity.prompt)).toBeVisible()
  })

  it('fails clearly for unsupported activity types', () => {
    render(
      <ActivityRenderer
        activity={{
          id: 'unsupported-1',
          type: 'drag-the-dragon' as never,
          prompt: 'Unsupported prompt',
          difficulty: 'easy',
          success: { mode: 'exact-match', stars: 1 },
          content: {
            kind: 'numeric-input',
            acceptedAnswers: ['1'],
          },
        }}
      />
    )

    expect(
      screen.getByText('Unsupported activity type: drag-the-dragon')
    ).toBeVisible()
  })
})
