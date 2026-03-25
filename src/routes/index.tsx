import { createFileRoute, Link } from '@tanstack/react-router'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { getBundledContentRepository } from '~/lib/content/repository'
import { heroPillars } from '~/lib/site-shell'

export const Route = createFileRoute('/')({
  component: HomeRoute,
})

function HomeRoute() {
  const contentSummary = getBundledContentRepository().getSummary()

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(21rem,0.9fr)]">
        <Card className="overflow-hidden border-border/60 bg-card/90 shadow-2xl shadow-primary/10">
          <CardContent className="space-y-6 p-6 md:p-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-primary">
              Foundation Batch
            </div>

            <div className="space-y-4">
              <h1 className="max-w-[11ch] text-4xl font-black tracking-tight text-balance md:text-6xl">
                Build math like an adventure, not a worksheet.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                The app shell now proves the project can boot as a TanStack
                Start app, route between parent and learner spaces, and carry
                the visual system needed for later lesson work.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link className={buttonVariants({ size: 'lg' })} to="/learn">
                Explore Learner Flow
              </Link>
              <Link
                className={buttonVariants({ size: 'lg', variant: 'secondary' })}
                to="/parents"
              >
                Preview Parent Space
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-primary text-primary-foreground shadow-xl shadow-primary/25">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-6 md:p-8">
            <div className="space-y-3">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-primary-foreground/75">
                What this batch unlocks
              </p>
              <h2 className="text-2xl font-black tracking-tight">
                A route-first shell for learner journeys, support surfaces, and
                testing.
              </h2>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl bg-white/12 p-4">
                <p className="text-sm font-semibold">
                  TanStack Start + TypeScript routing
                </p>
              </div>
              <div className="rounded-2xl bg-white/12 p-4">
                <p className="text-sm font-semibold">
                  Tailwind + selective shadcn support primitives
                </p>
              </div>
              <div className="rounded-2xl bg-white/12 p-4">
                <p className="text-sm font-semibold">
                  Unit, component, and end-to-end smoke coverage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {heroPillars.map((pillar) => (
          <Card
            className="border-border/60 bg-card/85 shadow-lg shadow-primary/5"
            key={pillar.title}
          >
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-black tracking-tight">
                {pillar.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {pillar.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card className="border-dashed border-primary/35 bg-accent/40">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">
              Why the shell matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              The app now has a healthy home for onboarding, lesson flow, and
              parent support work without forcing those concerns into one page.
            </p>
            <p>
              Styling primitives stay ready for support UI while learner-facing
              mechanics remain free to become custom interaction surfaces later.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">
              Healthy defaults for the next issues
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-2">
            <p>
              Routes render in development and production, so content loading,
              local state, and lesson runtime work can build on stable startup
              wiring.
            </p>
            <p>
              Tooling, formatting, and tests are already attached to the shell,
              which keeps the branch verifiable as new systems are added.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <Card className="border-border/60 bg-secondary text-secondary-foreground shadow-xl shadow-secondary/15">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">
              Example content pack is live in the shell
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-secondary-foreground/85">
            <p>{contentSummary.title}</p>
            <p>Version {contentSummary.version}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">
              Content repository baseline
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-4">
            <p>{contentSummary.gradeCount} grade loaded</p>
            <p>{contentSummary.skillCount} skill indexed</p>
            <p>{contentSummary.lessonCount} lesson ready</p>
            <p>{contentSummary.activityCount} activities validated</p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
