export type ProfilePreferences = {
  soundEnabled?: boolean
  reducedMotion?: boolean
  handedness?: 'left' | 'right' | 'unknown'
}

export type ProfileAvatar = {
  mascotStyle?: string
  color?: string
}

export type ProfilePlacement = {
  used?: boolean
  recommendedGrade?: 1 | 2 | 3
  recommendedSkillId?: string
  recommendedLessonId?: string
  summary?: string
}

export type LessonProgressRecord = {
  attemptCount: number
  bestStars: 0 | 1 | 2 | 3
  completed: boolean
  resumable: boolean
  lastActivityIndex?: number
  lastActivityId?: string
  lastPlayedAt?: string
  improvedOnReplay?: boolean
}

export type SkillMasteryRecord = {
  value: number
  status: 'not-started' | 'practicing' | 'approaching-mastery' | 'mastered'
  updatedAt?: string
}

export type RewardState = {
  totalStars: number
  badgeIds: string[]
  mapNodeIds: string[]
}

export type ResumeState = {
  lessonId?: string
  activityId?: string
  activityIndex?: number
  resumable: boolean
  updatedAt?: string
}

export type LearnerProgress = {
  unlockedLessonIds: string[]
  completedLessonIds: string[]
  lessonProgress: Record<string, LessonProgressRecord>
  skillMastery: Record<string, SkillMasteryRecord>
  rewards: RewardState
  resume: ResumeState
}

export type ChildProfile = {
  id: string
  displayName: string
  gradeStart: 1 | 2 | 3
  createdAt: string
  lastActiveAt?: string
  avatar?: ProfileAvatar
  placement?: ProfilePlacement
  preferences?: ProfilePreferences
  progress: LearnerProgress
}

export type StateStore = {
  schemaVersion: string
  deviceId: string
  contentVersion?: string
  activeProfileId?: string
  updatedAt?: string
  profiles: ChildProfile[]
}

export type StateStoreLoadResult = {
  state: StateStore
  source: 'storage' | 'example' | 'empty' | 'invalid'
  error?: Error
}
