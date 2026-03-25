import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { loadExampleStateStore } from '~/lib/state/store'

export const Route = createFileRoute('/parents')({
  component: ParentsRoute,
})

function ParentsRoute() {
  const exampleState = loadExampleStateStore()
  const exampleProfile = exampleState.profiles[0]

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/10">
          <CardHeader>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Local setup and progress summary will live here.
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground md:text-base">
            <p>
              The parent space is reserved for child profile setup, starting
              grade selection, and lightweight progress visibility.
            </p>
            <p>
              That keeps support tasks out of the learner journey while staying
              within the local-first MVP architecture.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed border-primary/35 bg-accent/45">
          <CardContent className="space-y-3 p-6 text-sm leading-6 text-muted-foreground">
            <p className="font-black uppercase tracking-[0.22em] text-primary">
              Parent-first baseline
            </p>
            <p>Local child profiles</p>
            <p>Manual starting grade choice</p>
            <p>Simple summary instead of heavy analytics</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="border-border/60 bg-secondary text-secondary-foreground shadow-xl shadow-secondary/15">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Example local state loads safely
            </h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-secondary-foreground/85">
            <p>Active profile: {exampleProfile?.displayName}</p>
            <p>
              Unlocked lessons:{' '}
              {exampleProfile?.progress.unlockedLessonIds.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-lg shadow-primary/5">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Persistence abstraction baseline
            </h2>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-3">
            <p>{exampleState.profiles.length} local profile loaded</p>
            <p>
              {exampleProfile?.progress.completedLessonIds.length} completed
              lesson
            </p>
            <p>Resume state ready for future onboarding and learner flow</p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
