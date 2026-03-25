import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '~/components/ui/card'

export const Route = createFileRoute('/learn')({
  component: LearnRoute,
})

function LearnRoute() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/10">
          <CardHeader>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Route space for the child-facing lesson journey.
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground md:text-base">
            <p>
              This page marks the future learner path where resume cards,
              activity rendering, and lesson progression will live.
            </p>
            <p>
              For now it proves the shell can separate learner-facing flow from
              support surfaces while keeping the app mobile-friendly.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-secondary text-secondary-foreground shadow-xl shadow-secondary/20">
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-secondary-foreground/70">
              Planned next
            </p>
            <div className="space-y-3 text-sm leading-6">
              <p>Resume-first child home behavior</p>
              <p>Map-based lesson progression</p>
              <p>Custom interaction mechanics</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
