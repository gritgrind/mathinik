import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import type {
  Activity,
  MultipleChoiceContent,
  NumericInputContent,
} from '~/lib/content/types'
import { MultipleChoiceActivity } from './MultipleChoiceActivity'
import { NumericInputActivity } from './NumericInputActivity'

const multipleChoiceActivity =
  loadBundledContentPack().grades[0]?.skills[0]?.lessons[0]?.activities.find(
    (entry) => entry.type === 'multiple-choice'
  )

const numericInputActivity: Activity & { content: NumericInputContent } = {
  id: 'numeric-check-1',
  type: 'numeric-input',
  prompt: 'How many apples are there?',
  difficulty: 'easy',
  success: { mode: 'numeric-match', stars: 1 },
  content: {
    kind: 'numeric-input',
    acceptedAnswers: [3],
  },
}

describe('support lesson activities', () => {
  it('renders multiple choice as a support format', async () => {
    if (
      !multipleChoiceActivity ||
      multipleChoiceActivity.content.kind !== 'multiple-choice'
    ) {
      throw new Error('Expected multiple-choice activity')
    }

    const user = userEvent.setup()
    render(
      <MultipleChoiceActivity
        activity={
          multipleChoiceActivity as Activity & {
            content: MultipleChoiceContent
          }
        }
      />
    )

    await user.click(screen.getByRole('button', { name: '3 apples' }))

    expect(screen.getByText('This support check is correct.')).toBeVisible()
  })

  it('renders numeric input as a support format', async () => {
    const user = userEvent.setup()
    render(<NumericInputActivity activity={numericInputActivity} />)

    await user.type(screen.getByRole('textbox'), '3')
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    expect(screen.getByText('This support check is correct.')).toBeVisible()
  })
})
