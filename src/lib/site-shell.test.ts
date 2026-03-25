import { describe, expect, it } from 'vitest'
import { getPrimaryNav, heroPillars } from './site-shell'

describe('site shell content', () => {
  it('exposes the three primary shell routes', () => {
    expect(getPrimaryNav().map((item) => item.href)).toEqual([
      '/',
      '/learn',
      '/parents',
    ])
  })

  it('defines the three home page pillars', () => {
    expect(heroPillars).toHaveLength(3)
  })
})
