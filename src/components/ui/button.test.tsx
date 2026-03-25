import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders content for the component smoke path', () => {
    render(<Button>Explore math</Button>)
    expect(screen.getByRole('button', { name: 'Explore math' })).toBeVisible()
  })
})
