import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import type { Activity, EquationBuilderContent } from '~/lib/content/types'
import { EquationBuilderActivity } from './EquationBuilderActivity'

const activity =
  loadBundledContentPack().grades[0]?.skills[0]?.lessons[0]?.activities.find(
    (entry) => entry.type === 'equation-builder'
  )

describe('EquationBuilderActivity', () => {
  it('places tokens into slots and recognizes the valid answer', async () => {
    if (!activity || activity.content.kind !== 'equation-builder') {
      throw new Error('Expected equation-builder activity')
    }

    const user = userEvent.setup()
    render(
      <EquationBuilderActivity
        activity={activity as Activity & { content: EquationBuilderContent }}
      />
    )

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getAllByRole('button', { name: 'Drop here' })[0])

    const openSlotsAfterFirst = screen.getAllByRole('button', {
      name: 'Drop here',
    })
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(openSlotsAfterFirst[0])

    const openSlotsAfterSecond = screen.getAllByRole('button', {
      name: 'Drop here',
    })
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(openSlotsAfterSecond[0])

    const openSlotsAfterThird = screen.getAllByRole('button', {
      name: 'Drop here',
    })
    await user.click(screen.getByRole('button', { name: '=' }))
    await user.click(openSlotsAfterThird[0])

    const openSlotsAfterFourth = screen.getAllByRole('button', {
      name: 'Drop here',
    })
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(openSlotsAfterFourth[0])

    expect(
      screen.getByText('Equation matches the content answer.')
    ).toBeVisible()
  })

  it('allows a wrong token to be cleared and corrected', async () => {
    if (!activity || activity.content.kind !== 'equation-builder') {
      throw new Error('Expected equation-builder activity')
    }

    const user = userEvent.setup()
    render(
      <EquationBuilderActivity
        activity={activity as Activity & { content: EquationBuilderContent }}
      />
    )

    await user.click(screen.getAllByRole('button', { name: '1' })[1])
    await user.click(screen.getAllByRole('button', { name: 'Drop here' })[0])
    await user.click(screen.getAllByRole('button', { name: '1' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Drop here' })[0])
    await user.click(screen.getAllByRole('button', { name: '1' })[1])

    expect(screen.getByText('Build the matching equation.')).toBeVisible()
  })
})
