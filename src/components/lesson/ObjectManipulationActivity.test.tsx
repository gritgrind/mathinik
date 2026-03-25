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

    const sourceApples = screen.getAllByRole('button', { name: /Apple/ })
    await user.click(sourceApples[0])
    await user.click(sourceApples[1])
    await user.click(sourceApples[2])
    await user.click(screen.getByRole('button', { name: 'Apple 3' }))

    expect(screen.getByText('Groups match the content answer.')).toBeVisible()
  })
})
