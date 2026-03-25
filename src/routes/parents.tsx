import { createFileRoute } from '@tanstack/react-router'
import { type FormEvent, useEffect, useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { getBundledContentRepository } from '~/lib/content/repository'
import { normalizeStateStore } from '~/lib/models/app-models'
import {
  addProfileToStateStore,
  createBrowserStatePersistence,
  createChildProfile,
  createEmptyStateStore,
} from '~/lib/state/store'

export const Route = createFileRoute('/parents')({
  component: ParentsRoute,
})

function ParentsRoute() {
  const [displayName, setDisplayName] = useState('')
  const [gradeStart, setGradeStart] = useState<'1' | '2' | '3'>('1')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')
  const contentVersion = getBundledContentRepository().getContentVersion()
  const [localState, setLocalState] = useState(() =>
    createEmptyStateStore({
      contentVersion,
    })
  )

  useEffect(() => {
    const persistence = createBrowserStatePersistence({ contentVersion })
    const result = persistence.loadStateStore()
    setLocalState(result.state)
    setStatus('ready')

    if (result.source === 'invalid') {
      setError(
        'Saved state was invalid, so Mathinik started from a safe local reset.'
      )
    }
  }, [contentVersion])

  const stateModels = normalizeStateStore(localState)
  const activeProfile = stateModels.activeProfile

  function handleCreateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    try {
      const persistence = createBrowserStatePersistence({ contentVersion })
      const now = new Date().toISOString()
      const profile = createChildProfile(
        {
          displayName,
          gradeStart: Number(gradeStart) as 1 | 2 | 3,
        },
        { now }
      )
      const nextState = addProfileToStateStore(localState, profile, { now })
      const savedState = persistence.saveStateStore(nextState)

      setLocalState(savedState)
      setDisplayName('')
      setGradeStart('1')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not create the child profile.'
      )
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/10">
          <CardHeader>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Create a child profile right on this device.
            </h1>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground md:text-base">
            <p>
              Start with a child name and a grade so the app can keep progress
              locally without asking the family for an account.
            </p>
            <p>
              This slice keeps onboarding parent-friendly while storing the
              active child profile through the validated local state boundary.
            </p>

            <form className="grid gap-4" onSubmit={handleCreateProfile}>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Child display name
                </span>
                <input
                  className="h-12 rounded-2xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Ava"
                  value={displayName}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Starting grade
                </span>
                <select
                  className="h-12 rounded-2xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
                  onChange={(event) =>
                    setGradeStart(event.target.value as '1' | '2' | '3')
                  }
                  value={gradeStart}
                >
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                </select>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  className={buttonVariants({ size: 'lg' })}
                  type="submit"
                >
                  Save local profile
                </button>
                <p className="text-sm text-muted-foreground">
                  {status === 'loading'
                    ? 'Loading local profiles...'
                    : `${stateModels.profiles.length} profile(s) stored on this device.`}
                </p>
              </div>

              {error ? (
                <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <Card className="border-dashed border-primary/35 bg-accent/45">
          <CardContent className="space-y-3 p-6 text-sm leading-6 text-muted-foreground">
            <p className="font-black uppercase tracking-[0.22em] text-primary">
              Parent setup baseline
            </p>
            <p>Create profiles without cloud accounts</p>
            <p>Keep the active child local to the browser</p>
            <p>Leave deeper summary work for later slices</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="border-border/60 bg-secondary text-secondary-foreground shadow-xl shadow-secondary/15">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Active local profile
            </h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-secondary-foreground/85">
            <p>Name: {activeProfile?.displayName ?? 'No active child yet'}</p>
            <p>
              Starting grade: {activeProfile?.gradeStart ?? 'Choose one above'}
            </p>
            <p>Unlocked lessons: {activeProfile?.unlockedLessonCount ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-lg shadow-primary/5">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Local profile persistence
            </h2>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-3">
            <p>{stateModels.profiles.length} local profile loaded</p>
            <p>{activeProfile?.completedLessonCount ?? 0} completed lesson</p>
            <p>Refresh-safe storage is ready for the next onboarding slices</p>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
