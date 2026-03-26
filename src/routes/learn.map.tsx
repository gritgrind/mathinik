import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { getBundledContentRepository } from '~/lib/content/repository'
import { getLessonMapItems } from '~/lib/map-progress'
import {
  normalizeContentPack,
  normalizeStateStore,
} from '~/lib/models/app-models'
import {
  createBrowserStatePersistence,
  createEmptyStateStore,
} from '~/lib/state/store'

export const Route = createFileRoute('/learn/map' as never)({
  component: LearnMapRoute,
})

function LearnMapRoute() {
  const contentRepository = getBundledContentRepository()
  const contentVersion = contentRepository.getContentVersion()
  const lessons = useMemo(
    () => normalizeContentPack(contentRepository.pack).lessons,
    [contentRepository]
  )
  const [localState, setLocalState] = useState(() =>
    createEmptyStateStore({ contentVersion })
  )

  useEffect(() => {
    const persistence = createBrowserStatePersistence({ contentVersion })
    setLocalState(persistence.loadStateStore().state)
  }, [contentVersion])

  const activeProfile = normalizeStateStore(localState).activeProfile
  const activeProfileRecord =
    localState.profiles.find((profile) => profile.id === activeProfile?.id) ??
    null
  const mapItems = getLessonMapItems(lessons, activeProfileRecord)
  const nextLesson = mapItems.find((item) => item.state === 'next')

  return (
    <section className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/10">
          <CardHeader>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              World map progression
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground md:text-base">
            <p>
              The learner map shows what is ready now, what comes next, and what
              is still locked behind stars and mastery.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {mapItems.map((item, index) => (
                <div
                  className={
                    item.state === 'locked'
                      ? 'rounded-[1.75rem] border border-dashed border-border bg-card p-5 opacity-55'
                      : item.state === 'completed'
                        ? 'rounded-[1.75rem] border border-primary/30 bg-primary/10 p-5'
                        : 'rounded-[1.75rem] border border-secondary/30 bg-secondary/10 p-5'
                  }
                  data-state={item.state}
                  data-testid={`map-item-${item.id}`}
                  key={item.id}
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                    Stop {index + 1}
                  </p>
                  <p className="mt-2 text-xl font-black tracking-tight text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Grade {item.gradeNumber} - {item.state}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-secondary text-secondary-foreground shadow-xl shadow-secondary/20">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Next recommended lesson
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-secondary-foreground/85">
            <p>{nextLesson?.title ?? 'No lesson recommendation yet.'}</p>
            <a className={buttonVariants({ size: 'lg' })} href="/learn">
              Back to child home
            </a>
          </CardContent>
        </Card>
      </section>
    </section>
  )
}
