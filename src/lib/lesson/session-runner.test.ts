import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { normalizeContentPack } from '~/lib/models/app-models'
import {
  advanceLessonSession,
  getCurrentActivity,
  startLessonSession,
  summarizeLessonSession,
} from './session-runner'

describe('lesson session runner', () => {
  it('starts a lesson from normalized content definitions', () => {
    const models = normalizeContentPack(loadBundledContentPack())
    const lesson = models.lessons[0]
    const activities = models.activitiesByLessonId.get(lesson.id) ?? []

    const session = startLessonSession(
      'child-preview',
      lesson,
      activities,
      '2026-03-25T11:00:00.000Z'
    )

    expect(session.lessonId).toBe(lesson.id)
    expect(getCurrentActivity(session, activities)?.id).toBe('combine-apples')
  })

  it('advances through activities and produces a summary shell', () => {
    const models = normalizeContentPack(loadBundledContentPack())
    const lesson = models.lessons[0]
    const activities = models.activitiesByLessonId.get(lesson.id) ?? []

    let session = startLessonSession(
      'child-preview',
      lesson,
      activities,
      '2026-03-25T11:00:00.000Z'
    )

    session = advanceLessonSession(session, '2026-03-25T11:01:00.000Z')
    session = advanceLessonSession(session, '2026-03-25T11:02:00.000Z')
    session = advanceLessonSession(session, '2026-03-25T11:03:00.000Z')

    expect(session.status).toBe('completed')
    expect(summarizeLessonSession(session)).toMatchObject({
      totalActivities: 3,
      completedActivities: 3,
      status: 'completed',
      lastCompletedActivityId: 'quick-check',
    })
  })
})
