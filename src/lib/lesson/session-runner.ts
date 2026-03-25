import type { ActivityModel, LessonModel } from '~/lib/models/app-models'

export type LessonSessionStatus = 'idle' | 'in-progress' | 'completed'

export type LessonSession = {
  sessionId: string
  profileId: string
  lessonId: string
  lessonTitle: string
  activityIds: string[]
  currentActivityIndex: number
  completedActivityIds: string[]
  status: LessonSessionStatus
  startedAt: string
  completedAt: string | null
}

export type LessonSessionSummary = {
  lessonId: string
  lessonTitle: string
  totalActivities: number
  completedActivities: number
  status: LessonSessionStatus
  lastCompletedActivityId: string | null
}

export function startLessonSession(
  profileId: string,
  lesson: LessonModel,
  activities: ActivityModel[],
  now = new Date().toISOString()
): LessonSession {
  if (activities.length === 0) {
    throw new Error(`Lesson ${lesson.id} cannot start without activities`)
  }

  return {
    sessionId: `session-${lesson.id}-${now.replace(/[^0-9]/g, '').slice(-10)}`,
    profileId,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    activityIds: activities.map((activity) => activity.id),
    currentActivityIndex: 0,
    completedActivityIds: [],
    status: 'in-progress',
    startedAt: now,
    completedAt: null,
  }
}

export function getCurrentActivity(
  session: LessonSession,
  activities: ActivityModel[]
): ActivityModel | undefined {
  return activities[session.currentActivityIndex]
}

export function advanceLessonSession(
  session: LessonSession,
  now = new Date().toISOString()
): LessonSession {
  if (session.status === 'completed') {
    return session
  }

  const currentActivityId = session.activityIds[session.currentActivityIndex]

  if (!currentActivityId) {
    throw new Error(
      `Lesson session ${session.sessionId} is missing its current activity`
    )
  }

  const completedActivityIds = session.completedActivityIds.includes(
    currentActivityId
  )
    ? session.completedActivityIds
    : [...session.completedActivityIds, currentActivityId]

  const isLastActivity =
    session.currentActivityIndex >= session.activityIds.length - 1

  return {
    ...session,
    completedActivityIds,
    currentActivityIndex: isLastActivity
      ? session.currentActivityIndex
      : session.currentActivityIndex + 1,
    status: isLastActivity ? 'completed' : 'in-progress',
    completedAt: isLastActivity ? now : null,
  }
}

export function summarizeLessonSession(
  session: LessonSession
): LessonSessionSummary {
  return {
    lessonId: session.lessonId,
    lessonTitle: session.lessonTitle,
    totalActivities: session.activityIds.length,
    completedActivities: session.completedActivityIds.length,
    status: session.status,
    lastCompletedActivityId:
      session.completedActivityIds[session.completedActivityIds.length - 1] ??
      null,
  }
}
