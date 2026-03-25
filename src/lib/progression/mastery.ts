import type { LessonModel } from '~/lib/models/app-models'
import type { StateStore } from '~/lib/state/types'
import type { LessonCompletionOutcome } from './lesson-completion'

export type MasteryUpdate = {
  skillId: string
  value: number
  status: 'not-started' | 'practicing' | 'approaching-mastery' | 'mastered'
}

export function calculateSkillMasteryUpdate(
  lesson: LessonModel,
  outcome: LessonCompletionOutcome,
  previousValue = 0
): MasteryUpdate {
  const nextValue = Math.min(
    1,
    roundToTwoDecimals(previousValue + (outcome.bestStars / 3) * 0.35)
  )

  return {
    skillId: lesson.skillId,
    value: nextValue,
    status: getMasteryStatus(nextValue),
  }
}

export function applySkillMasteryToStateStore(
  state: StateStore,
  profileId: string,
  update: MasteryUpdate,
  now = new Date().toISOString()
): StateStore {
  return {
    ...state,
    updatedAt: now,
    profiles: state.profiles.map((profile) => {
      if (profile.id !== profileId) {
        return profile
      }

      return {
        ...profile,
        lastActiveAt: now,
        progress: {
          ...profile.progress,
          skillMastery: {
            ...profile.progress.skillMastery,
            [update.skillId]: {
              value: update.value,
              status: update.status,
              updatedAt: now,
            },
          },
        },
      }
    }),
  }
}

function getMasteryStatus(value: number) {
  if (value >= 0.85) return 'mastered'
  if (value >= 0.6) return 'approaching-mastery'
  if (value > 0) return 'practicing'
  return 'not-started'
}

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100
}
