import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityRenderer } from '~/components/lesson/ActivityRenderer'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { getBundledContentRepository } from '~/lib/content/repository'
import {
  type ActivityAttemptRecord,
  resolveFeedbackAction,
} from '~/lib/feedback/feedback-flow'
import {
  advanceLessonSession,
  getCurrentActivity,
  type LessonSession,
  resumeLessonSession,
  startLessonSession,
  summarizeLessonSession,
} from '~/lib/lesson/session-runner'
import {
  normalizeContentPack,
  normalizeStateStore,
} from '~/lib/models/app-models'
import {
  applyLessonCompletionToStateStore,
  calculateLessonCompletion,
} from '~/lib/progression/lesson-completion'
import {
  applySkillMasteryToStateStore,
  calculateSkillMasteryUpdate,
} from '~/lib/progression/mastery'
import {
  createBrowserStatePersistence,
  createEmptyStateStore,
  updateLessonSessionStateInStateStore,
} from '~/lib/state/store'

export const Route = createFileRoute('/learn')({
  component: LearnRoute,
})

function LearnRoute() {
  const contentRepository = getBundledContentRepository()
  const contentVersion = contentRepository.getContentVersion()
  const contentModels = useMemo(
    () => normalizeContentPack(contentRepository.pack),
    [contentRepository]
  )
  const lesson = contentModels.lessons[0]
  const activities = contentModels.activitiesByLessonId.get(lesson.id) ?? []
  const [storageStatus, setStorageStatus] = useState<'loading' | 'ready'>(
    'loading'
  )
  const [localState, setLocalState] = useState(() =>
    createEmptyStateStore({ contentVersion })
  )
  const [session, setSession] = useState<LessonSession | null>(null)
  const [attemptsByActivityId, setAttemptsByActivityId] = useState<
    Record<string, ActivityAttemptRecord[]>
  >({})
  const [followUpSatisfiedByActivityId, setFollowUpSatisfiedByActivityId] =
    useState<Record<string, boolean>>({})

  const stateModels = normalizeStateStore(localState)
  const activeProfile = stateModels.activeProfile

  useEffect(() => {
    const persistence = createBrowserStatePersistence({ contentVersion })
    const result = persistence.loadStateStore()
    setLocalState(result.state)
    setStorageStatus('ready')
  }, [contentVersion])

  useEffect(() => {
    if (session) {
      return
    }

    if (!activeProfile?.resumableLessonId) {
      return
    }

    if (activeProfile.resumableLessonId !== lesson.id) {
      return
    }

    setSession(
      resumeLessonSession(activeProfile.id, lesson, activities, {
        activityIndex:
          localState.profiles.find((profile) => profile.id === activeProfile.id)
            ?.progress.resume.activityIndex ?? 0,
      })
    )
  }, [activeProfile, activities, lesson, localState.profiles, session])

  const currentActivity = session
    ? getCurrentActivity(session, activities)
    : null
  const currentActivityDefinition =
    currentActivity && session
      ? contentRepository.getActivity(session.lessonId, currentActivity.id)
      : null
  const lessonDefinition = contentRepository.getLesson(lesson.id)
  const lessonActivityDefinitions = useMemo(
    () =>
      (lessonDefinition?.activities ?? [])
        .map((activity) =>
          contentRepository.getActivity(lesson.id, activity.id)
        )
        .filter((activity): activity is NonNullable<typeof activity> =>
          Boolean(activity)
        ),
    [contentRepository, lesson.id, lessonDefinition]
  )
  const summary = useMemo(
    () => (session ? summarizeLessonSession(session) : null),
    [session]
  )
  const lessonOutcome = session
    ? calculateLessonCompletion(
        lessonActivityDefinitions,
        attemptsByActivityId,
        (localState.profiles.find((profile) => profile.id === activeProfile?.id)
          ?.progress.lessonProgress[lesson.id]?.bestStars as
          | 0
          | 1
          | 2
          | 3
          | undefined) ?? 0
      )
    : null
  const feedbackAction =
    currentActivityDefinition && currentActivity
      ? resolveFeedbackAction(
          currentActivityDefinition,
          attemptsByActivityId[currentActivity.id] ?? [],
          {
            followUpSatisfied:
              followUpSatisfiedByActivityId[currentActivity.id] ?? false,
          }
        )
      : null

  function handleStartLesson() {
    if (!activeProfile) {
      return
    }

    const persistence = createBrowserStatePersistence({ contentVersion })
    const nextSession = startLessonSession(activeProfile.id, lesson, activities)
    const nextState = updateLessonSessionStateInStateStore(
      localState,
      {
        profileId: activeProfile.id,
        lessonId: lesson.id,
        activityId: nextSession.activityIds[0],
        activityIndex: 0,
        resumable: true,
        completed: false,
      },
      { incrementAttempt: true }
    )

    setLocalState(persistence.saveStateStore(nextState))
    setSession(nextSession)
  }

  function handleAdvanceLesson() {
    if (!session || !activeProfile) {
      return
    }

    const persistence = createBrowserStatePersistence({ contentVersion })
    const nextSession = advanceLessonSession(session)
    const nextActivityId =
      nextSession.activityIds[nextSession.currentActivityIndex]
    const nextState = updateLessonSessionStateInStateStore(localState, {
      profileId: activeProfile.id,
      lessonId: lesson.id,
      activityId: nextActivityId,
      activityIndex: nextSession.currentActivityIndex,
      resumable: nextSession.status !== 'completed',
      completed: nextSession.status === 'completed',
    })

    const completedState =
      nextSession.status === 'completed'
        ? (() => {
            const completionOutcome = calculateLessonCompletion(
              lessonActivityDefinitions,
              attemptsByActivityId,
              (localState.profiles.find(
                (profile) => profile.id === activeProfile.id
              )?.progress.lessonProgress[lesson.id]?.bestStars as
                | 0
                | 1
                | 2
                | 3
                | undefined) ?? 0
            )
            const stateWithCompletion = applyLessonCompletionToStateStore(
              nextState,
              nextSession,
              completionOutcome
            )
            const masteryUpdate = calculateSkillMasteryUpdate(
              lesson,
              completionOutcome,
              localState.profiles.find(
                (profile) => profile.id === activeProfile.id
              )?.progress.skillMastery[lesson.skillId]?.value ?? 0
            )

            return applySkillMasteryToStateStore(
              stateWithCompletion,
              activeProfile.id,
              masteryUpdate
            )
          })()
        : nextState

    setLocalState(persistence.saveStateStore(completedState))
    setSession(nextSession)
  }

  function handleRecordAttempt(correct: boolean) {
    if (!currentActivity) {
      return
    }

    setAttemptsByActivityId((currentAttempts) => ({
      ...currentAttempts,
      [currentActivity.id]: [
        ...(currentAttempts[currentActivity.id] ?? []),
        { correct },
      ],
    }))
  }

  function handleSatisfyFollowUp() {
    if (!currentActivity) {
      return
    }

    setFollowUpSatisfiedByActivityId((currentState) => ({
      ...currentState,
      [currentActivity.id]: true,
    }))
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
              <p>
                Active learner:{' '}
                {activeProfile?.displayName ??
                  (storageStatus === 'loading'
                    ? 'Loading profile...'
                    : 'Create a profile in Parents first')}
              </p>
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
                {currentActivityDefinition ? (
                  <ActivityRenderer activity={currentActivityDefinition} />
                ) : (
                  <p>Missing activity definition for this session step.</p>
                )}
                {feedbackAction ? (
                  <div className="space-y-3 rounded-[1.5rem] border border-border/60 bg-background/75 p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Feedback step: {feedbackAction.kind}
                    </p>
                    <p>{feedbackAction.message}</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        className={buttonVariants({ variant: 'secondary' })}
                        onClick={() => handleRecordAttempt(false)}
                        type="button"
                      >
                        Record struggle
                      </button>
                      <button
                        className={buttonVariants({ variant: 'secondary' })}
                        onClick={() => handleRecordAttempt(true)}
                        type="button"
                      >
                        Record success
                      </button>
                      {feedbackAction.kind === 'follow-up' ? (
                        <button
                          className={buttonVariants({ variant: 'secondary' })}
                          onClick={handleSatisfyFollowUp}
                          type="button"
                        >
                          Confirm second representation
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
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
                {activeProfile?.resumableLessonId === lesson.id ? (
                  <p>
                    A resumable session was found and restored to activity{' '}
                    {(localState.profiles.find(
                      (profile) => profile.id === activeProfile.id
                    )?.progress.resume.activityIndex ?? 0) + 1}
                    .
                  </p>
                ) : null}
                <button
                  className={buttonVariants({ size: 'lg' })}
                  onClick={handleStartLesson}
                  type="button"
                  disabled={!activeProfile}
                >
                  {activeProfile?.resumableLessonId === lesson.id
                    ? 'Restart lesson skeleton'
                    : 'Start lesson skeleton'}
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
            <p>Earned stars: {lessonOutcome?.earnedStars ?? 0}</p>
            <p>
              Skill mastery:{' '}
              {activeProfile?.id
                ? (localState.profiles.find(
                    (profile) => profile.id === activeProfile.id
                  )?.progress.skillMastery[lesson.skillId]?.status ??
                  'not-started')
                : 'not-started'}
            </p>
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
