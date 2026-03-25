import { createFileRoute } from '@tanstack/react-router'
import { type FormEvent, useEffect, useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { getBundledContentRepository } from '~/lib/content/repository'
import {
  normalizeContentPack,
  normalizeStateStore,
} from '~/lib/models/app-models'
import {
  addProfileToStateStore,
  createBrowserStatePersistence,
  createChildProfile,
  createEmptyStateStore,
  setActiveProfileInStateStore,
  updateProfilePlacementInStateStore,
} from '~/lib/state/store'

export const Route = createFileRoute('/parents')({
  component: ParentsRoute,
})

function ParentsRoute() {
  const [displayName, setDisplayName] = useState('')
  const [gradeStart, setGradeStart] = useState<'1' | '2' | '3'>('1')
  const [manualGradeStart, setManualGradeStart] = useState<'1' | '2' | '3'>('1')
  const [placementGrade, setPlacementGrade] = useState<'1' | '2' | '3'>('1')
  const [placementLessonId, setPlacementLessonId] = useState('')
  const [placementSummary, setPlacementSummary] = useState(
    'Placement shell recommendation saved locally.'
  )
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')
  const contentRepository = getBundledContentRepository()
  const contentVersion = contentRepository.getContentVersion()
  const lessonOptions = normalizeContentPack(contentRepository.pack).lessons
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

  useEffect(() => {
    if (!activeProfile) {
      setManualGradeStart('1')
      setPlacementGrade('1')
      setPlacementLessonId(lessonOptions[0]?.id ?? '')
      setPlacementSummary('Placement shell recommendation saved locally.')
      return
    }

    const activeGrade = String(activeProfile.gradeStart) as '1' | '2' | '3'

    setManualGradeStart(activeGrade)
    setPlacementGrade(
      String(activeProfile.recommendedGrade ?? activeProfile.gradeStart) as
        | '1'
        | '2'
        | '3'
    )
    setPlacementLessonId(
      activeProfile.recommendedLessonId ?? lessonOptions[0]?.id ?? ''
    )
    setPlacementSummary(
      activeProfile.placementSummary ??
        'Placement shell recommendation saved locally.'
    )
  }, [activeProfile, lessonOptions])

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

  function handleSaveManualStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!activeProfile) {
      setError('Create a child profile before saving onboarding choices.')
      return
    }

    setError(null)

    try {
      const persistence = createBrowserStatePersistence({ contentVersion })
      const now = new Date().toISOString()
      const nextState = updateProfilePlacementInStateStore(
        localState,
        {
          profileId: activeProfile.id,
          mode: 'manual',
          gradeStart: Number(manualGradeStart) as 1 | 2 | 3,
          summary: `Manual grade ${manualGradeStart} starting point selected.`,
        },
        { now }
      )

      setLocalState(persistence.saveStateStore(nextState))
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not save the manual starting grade.'
      )
    }
  }

  function handleSavePlacementShell(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!activeProfile) {
      setError('Create a child profile before saving onboarding choices.')
      return
    }

    const recommendedLesson = lessonOptions.find(
      (lesson) => lesson.id === placementLessonId
    )

    if (!recommendedLesson) {
      setError('Choose a lesson recommendation for the placement shell.')
      return
    }

    setError(null)

    try {
      const persistence = createBrowserStatePersistence({ contentVersion })
      const now = new Date().toISOString()
      const nextState = updateProfilePlacementInStateStore(
        localState,
        {
          profileId: activeProfile.id,
          mode: 'placement',
          gradeStart: Number(placementGrade) as 1 | 2 | 3,
          recommendedGrade: Number(placementGrade) as 1 | 2 | 3,
          recommendedSkillId: recommendedLesson.skillId,
          recommendedLessonId: recommendedLesson.id,
          summary:
            placementSummary.trim() ||
            'Placement shell recommendation saved locally.',
        },
        { now }
      )

      setLocalState(persistence.saveStateStore(nextState))
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not save the placement recommendation.'
      )
    }
  }

  function handleSwitchProfile(profileId: string) {
    setError(null)

    try {
      const persistence = createBrowserStatePersistence({ contentVersion })
      const now = new Date().toISOString()
      const nextState = setActiveProfileInStateStore(localState, profileId, {
        now,
      })

      setLocalState(persistence.saveStateStore(nextState))
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not switch the active child profile.'
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

      <section className="grid gap-4">
        <Card className="border-border/60 bg-card/90 shadow-lg shadow-primary/5">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Profile switcher
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Switch the active child without mixing another learner&apos;s
              local grade path, placement shell, or progress summary.
            </p>

            <div className="flex flex-wrap gap-3">
              {stateModels.profiles.map((profile) => (
                <button
                  className={buttonVariants({
                    variant:
                      profile.id === activeProfile?.id
                        ? 'default'
                        : 'secondary',
                  })}
                  key={profile.id}
                  onClick={() => handleSwitchProfile(profile.id)}
                  type="button"
                >
                  {profile.displayName}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/10">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Manual starting grade
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              Keep onboarding lightweight by choosing a clear starting point for
              the active child profile.
            </p>

            <form className="grid gap-4" onSubmit={handleSaveManualStart}>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Manual grade path
                </span>
                <select
                  className="h-12 rounded-2xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
                  onChange={(event) =>
                    setManualGradeStart(event.target.value as '1' | '2' | '3')
                  }
                  value={manualGradeStart}
                >
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                </select>
              </label>

              <button
                className={buttonVariants({ variant: 'secondary' })}
                type="submit"
              >
                Save manual start
              </button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-primary text-primary-foreground shadow-xl shadow-primary/20">
          <CardHeader>
            <h2 className="text-2xl font-black tracking-tight">
              Optional placement shell
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-primary-foreground/85">
            <p>
              This shell stores a lightweight recommendation now, leaving full
              placement intelligence for a later issue.
            </p>

            <form className="grid gap-4" onSubmit={handleSavePlacementShell}>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-primary-foreground">
                  Recommended grade
                </span>
                <select
                  className="h-12 rounded-2xl border border-white/20 bg-white/10 px-4 text-base text-primary-foreground outline-none transition focus:border-white/50 focus:ring-2 focus:ring-white/30"
                  onChange={(event) =>
                    setPlacementGrade(event.target.value as '1' | '2' | '3')
                  }
                  value={placementGrade}
                >
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-primary-foreground">
                  Recommended lesson shell
                </span>
                <select
                  className="h-12 rounded-2xl border border-white/20 bg-white/10 px-4 text-base text-primary-foreground outline-none transition focus:border-white/50 focus:ring-2 focus:ring-white/30"
                  onChange={(event) => setPlacementLessonId(event.target.value)}
                  value={placementLessonId}
                >
                  {lessonOptions.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                      Grade {lesson.gradeNumber} - {lesson.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-primary-foreground">
                  Recommendation summary
                </span>
                <textarea
                  className="min-h-28 rounded-[1.5rem] border border-white/20 bg-white/10 px-4 py-3 text-base text-primary-foreground outline-none transition focus:border-white/50 focus:ring-2 focus:ring-white/30"
                  onChange={(event) => setPlacementSummary(event.target.value)}
                  value={placementSummary}
                />
              </label>

              <button className={buttonVariants()} type="submit">
                Save placement shell
              </button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
