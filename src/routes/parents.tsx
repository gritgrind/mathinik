import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader } from '~/components/ui/card'

export const Route = createFileRoute('/parents')({
  component: ParentsRoute,
})

function ParentsRoute() {
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
    </main>
  )
}
