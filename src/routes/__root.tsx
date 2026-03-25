/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { ReactNode } from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { getPrimaryNav } from '~/lib/site-shell'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      { title: 'Mathinik' },
      {
        name: 'description',
        content:
          'Offline-first math adventures for young learners, scaffolded with TanStack Start.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: NotFound,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  const navItems = getPrimaryNav()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(243,155,63,0.34),_transparent_54%),radial-gradient(circle_at_18%_24%,_rgba(33,155,148,0.14),_transparent_24%),linear-gradient(180deg,_rgba(255,244,219,0.95),_rgba(255,251,242,1))]" />
          <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4 md:px-6">
              <div className="mr-auto flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-black text-primary-foreground shadow-lg shadow-primary/25">
                  M
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">
                    Mathinik
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interactive math adventures for Grades 1 to 3
                  </p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    activeOptions={{ exact: item.href === '/' }}
                    activeProps={{
                      className:
                        'bg-foreground text-background shadow-lg shadow-foreground/10',
                    }}
                    className="rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground"
                    key={item.href}
                    to={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          {children}
        </div>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
