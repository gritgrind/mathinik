export type NavItem = {
  href: '/' | '/learn' | '/parents'
  label: string
}

export type HeroPillar = {
  title: string
  body: string
}

const primaryNav: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/learn', label: 'Learn' },
  { href: '/parents', label: 'Parents' },
]

export const heroPillars: HeroPillar[] = [
  {
    title: 'Offline-first shell',
    body: 'The app boots with route structure that can later support PWA and local-first state behavior without reworking the top-level experience.',
  },
  {
    title: 'Supportive visual system',
    body: 'Tailwind tokens and selective shadcn primitives give the shell deliberate styling without letting generic UI kits define learner interactions.',
  },
  {
    title: 'Verifiable from day one',
    body: 'Unit, component, and end-to-end smoke tests already guard the shell so future work starts from a measurable baseline.',
  },
]

export function getPrimaryNav() {
  return primaryNav
}
