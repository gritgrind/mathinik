import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import type { Activity, ObjectManipulationContent } from '~/lib/content/types'
import { ObjectManipulationActivity } from './ObjectManipulationActivity'

const activity =
  loadBundledContentPack().grades[0]?.skills[0]?.lessons[0]?.activities.find(
    (entry) => entry.type === 'object-manipulation'
  )

describe('ObjectManipulationActivity', () => {
  it('moves objects between groups and recognizes the valid grouping', async () => {
    if (!activity || activity.content.kind !== 'object-manipulation') {
      throw new Error('Expected object-manipulation activity')
    }

    const user = userEvent.setup()
    render(
      <ObjectManipulationActivity
        activity={activity as Activity & { content: ObjectManipulationContent }}
      />
    )

    const sourcePanel = screen.getByRole('button', { name: /Source/ })
    const groupAPanel = screen.getByRole('button', { name: /Group A/ })
    const groupBPanel = screen.getByRole('button', { name: /Group B/ })

    await user.click(screen.getByRole('button', { name: 'Apple 1' }))
    await user.click(groupAPanel)
    await user.click(screen.getByRole('button', { name: 'Apple 2' }))
    await user.click(groupAPanel)
    await user.click(screen.getByRole('button', { name: 'Apple 3' }))
    await user.click(groupBPanel)

    await user.click(screen.getByRole('button', { name: 'Apple 3' }))
    await user.click(sourcePanel)
    await user.click(screen.getByRole('button', { name: 'Apple 3' }))
    await user.click(groupBPanel)

    expect(screen.getByText('Groups match the content answer.')).toBeVisible()
  })

  it('shows unsolved feedback again after moving an object out of a valid grouping', async () => {
    if (!activity || activity.content.kind !== 'object-manipulation') {
      throw new Error('Expected object-manipulation activity')
    }

    const user = userEvent.setup()
    render(
      <ObjectManipulationActivity
        activity={activity as Activity & { content: ObjectManipulationContent }}
      />
    )

    const sourcePanel = screen.getByRole('button', { name: /Source/ })
    const groupAPanel = screen.getByRole('button', { name: /Group A/ })
    const groupBPanel = screen.getByRole('button', { name: /Group B/ })

    await user.click(screen.getByRole('button', { name: 'Apple 1' }))
    await user.click(groupAPanel)
    await user.click(screen.getByRole('button', { name: 'Apple 2' }))
    await user.click(groupAPanel)
    await user.click(screen.getByRole('button', { name: 'Apple 3' }))
    await user.click(groupBPanel)

    expect(screen.getByText('Groups match the content answer.')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Apple 3' }))
    await user.click(sourcePanel)

    expect(screen.getByText('Build the matching groups.')).toBeVisible()
  })
})
