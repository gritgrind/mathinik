import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { getBundledContentRepository } from '~/lib/content/repository'
import {
  normalizeContentPack,
  normalizeStateStore,
} from '~/lib/models/app-models'
import { getLatestCompletedLessonId } from '~/lib/progression/latest-completion'
import {
  createBrowserStatePersistence,
  createEmptyStateStore,
} from '~/lib/state/store'

export const Route = createFileRoute('/learn/completed' as never)({
  component: LearnCompletedRoute,
})

function LearnCompletedRoute() {
  const contentRepository = getBundledContentRepository()
  const contentVersion = contentRepository.getContentVersion()
  const contentModels = useMemo(
    () => normalizeContentPack(contentRepository.pack),
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
  const latestCompletedLessonId =
    getLatestCompletedLessonId(activeProfileRecord)
  const latestCompletedLesson = latestCompletedLessonId
    ? contentModels.lessonsById.get(latestCompletedLessonId)
    : null
  const latestLessonProgress = latestCompletedLessonId
    ? activeProfileRecord?.progress.lessonProgress[latestCompletedLessonId]
    : null
  const latestReward = latestCompletedLessonId
    ? contentRepository.getLesson(latestCompletedLessonId)?.reward
    : null

  return (
    <section className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
        <Card className="border-border/60 bg-primary text-primary-foreground shadow-xl shadow-primary/20">
          <CardHeader>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Lesson complete
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-primary-foreground/85">
            <p>{latestCompletedLesson?.title ?? 'No completed lesson yet.'}</p>
            <p>Stars earned: {latestLessonProgress?.bestStars ?? 0}</p>
            <p>
              Progress outcome:{' '}
              {latestLessonProgress?.improvedOnReplay
                ? 'Improved replay'
                : 'Progress saved'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/10">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">Rewards</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Badge: {latestReward?.badgeId ?? 'No badge yet'}</p>
            <p>Map node: {latestReward?.mapNodeId ?? 'No map reward yet'}</p>
            <p>Total stars: {activeProfile?.totalStars ?? 0}</p>
            <div className="flex flex-wrap gap-3">
              <a className={buttonVariants({ size: 'lg' })} href="/learn/map">
                View next lesson
              </a>
              <a
                className={buttonVariants({ size: 'lg', variant: 'secondary' })}
                href="/learn"
              >
                Back to child home
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  )
}
