import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { getBundledContentRepository } from '~/lib/content/repository'
import {
  advanceLessonSession,
  getCurrentActivity,
  type LessonSession,
  startLessonSession,
  summarizeLessonSession,
} from '~/lib/lesson/session-runner'
import { normalizeContentPack } from '~/lib/models/app-models'

export const Route = createFileRoute('/learn')({
  component: LearnRoute,
})

function LearnRoute() {
  const contentModels = normalizeContentPack(getBundledContentRepository().pack)
  const lesson = contentModels.lessons[0]
  const activities = contentModels.activitiesByLessonId.get(lesson.id) ?? []
  const [session, setSession] = useState<LessonSession | null>(null)

  const currentActivity = session
    ? getCurrentActivity(session, activities)
    : null
  const summary = useMemo(
    () => (session ? summarizeLessonSession(session) : null),
    [session]
  )

  function handleStartLesson() {
    setSession(startLessonSession('child-preview', lesson, activities))
  }

  function handleAdvanceLesson() {
    if (!session) {
      return
    }

    setSession(advanceLessonSession(session))
  }

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
              Lesson runner skeleton
            </p>
            <div className="space-y-3 text-sm leading-6">
              <p>Lesson: {lesson.title}</p>
              <p>{lesson.activityCount} activities in this starter flow</p>
              <p>Status: {summary?.status ?? 'idle'}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]">
        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/10">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Lesson session shell
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground md:text-base">
            {session ? (
              <>
                <p>
                  Current activity {session.currentActivityIndex + 1} of{' '}
                  {session.activityIds.length}
                </p>
                <p>{currentActivity?.prompt}</p>
                <p>Renderer type: {currentActivity?.type}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className={buttonVariants({ size: 'lg' })}
                    onClick={handleAdvanceLesson}
                    type="button"
                  >
                    {session.status === 'completed'
                      ? 'Lesson complete'
                      : session.currentActivityIndex ===
                          session.activityIds.length - 1
                        ? 'Finish lesson'
                        : 'Advance to next activity'}
                  </button>
                  <button
                    className={buttonVariants({
                      size: 'lg',
                      variant: 'secondary',
                    })}
                    onClick={handleStartLesson}
                    type="button"
                  >
                    Restart skeleton
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p>
                  Start the first lesson session to prove the app can move from
                  content definitions into a tracked activity flow.
                </p>
                <button
                  className={buttonVariants({ size: 'lg' })}
                  onClick={handleStartLesson}
                  type="button"
                >
                  Start lesson skeleton
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-dashed border-primary/35 bg-accent/45">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Session summary shell
            </h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>
              Total activities:{' '}
              {summary?.totalActivities ?? lesson.activityCount}
            </p>
            <p>Completed activities: {summary?.completedActivities ?? 0}</p>
            <p>
              Last completed step:{' '}
              {summary?.lastCompletedActivityId ?? 'None yet'}
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
