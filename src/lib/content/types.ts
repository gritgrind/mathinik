export type ActivityType =
  | 'equation-builder'
  | 'object-manipulation'
  | 'multiple-choice'
  | 'numeric-input'

export type ContentDomain =
  | 'number-sense'
  | 'addition-subtraction'
  | 'multiplication-foundations'
  | 'word-problems'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type SupportText = {
  text?: string
  visualCue?: string
}

export type ActivityFollowUp = {
  mode: 'confirm-representation' | 'second-representation' | 'guided-retry'
  prompt: string
}

export type ActivityAudio = {
  successSfx?: string
  errorSfx?: string
  rewardSfx?: string
}

export type ActivityUi = {
  theme?: string
  snapMode?: 'forgiving' | 'strict'
  showUndo?: boolean
}

export type ActivitySuccess = {
  mode: 'exact-match' | 'set-match' | 'numeric-match' | 'choice-match'
  stars: 1 | 2 | 3
}

export type TokenValue = number | string

export type Token = {
  id: string
  type: 'number' | 'operator' | 'object-group' | 'equals'
  label: string
  value?: TokenValue
  visual?: string
}

export type TokenReference = {
  tokenId: string
}

export type EquationAnswer = {
  left: string[]
  right: string[]
}

export type SceneObject = {
  id: string
  kind: string
  count: number
  groupable?: boolean
}

export type Scene = {
  background?: string
  objects: SceneObject[]
}

export type ObjectAnswer = {
  expectedCount?: number
  expectedGroups?: number[]
  matchTargetId?: string
}

export type Choice = {
  id: string
  label: string
  visual?: string
}

export type EquationBuilderContent = {
  kind: 'equation-builder'
  leftSide: TokenReference[]
  rightSide: TokenReference[]
  palette: Token[]
  validAnswers: EquationAnswer[]
}

export type ObjectManipulationContent = {
  kind: 'object-manipulation'
  scene: Scene
  task: string
  validAnswers: ObjectAnswer[]
}

export type MultipleChoiceContent = {
  kind: 'multiple-choice'
  choices: Choice[]
  correctChoiceIds: string[]
}

export type NumericInputContent = {
  kind: 'numeric-input'
  acceptedAnswers: Array<number | string>
}

export type ActivityContent =
  | EquationBuilderContent
  | ObjectManipulationContent
  | MultipleChoiceContent
  | NumericInputContent

export type Activity = {
  id: string
  type: ActivityType
  prompt: string
  intro?: string
  difficulty: Difficulty
  masteryWeight?: number
  hint?: SupportText
  explanation?: SupportText
  followUp?: ActivityFollowUp
  audio?: ActivityAudio
  ui?: ActivityUi
  success: ActivitySuccess
  content: ActivityContent
}

export type LessonUnlock = {
  requiresLessonIds?: string[]
  minStars?: number
  minMastery?: number
}

export type LessonReward = {
  starsAvailable?: number
  badgeId?: string
  mapNodeId?: string
}

export type Lesson = {
  id: string
  slug: string
  title: string
  goal: string
  estimatedMinutes?: number
  tags?: string[]
  unlock?: LessonUnlock
  reward?: LessonReward
  activities: Activity[]
}

export type Skill = {
  id: string
  slug: string
  title: string
  domain: ContentDomain
  description?: string
  lessons: Lesson[]
}

export type Grade = {
  id: string
  grade: 1 | 2 | 3
  title: string
  skills: Skill[]
}

export type ContentPack = {
  schemaVersion: string
  packId: string
  title: string
  description?: string
  version: string
  locale?: string
  updatedAt?: string
  grades: Grade[]
}

export type ContentPackSummary = {
  packId: string
  title: string
  version: string
  gradeCount: number
  skillCount: number
  lessonCount: number
  activityCount: number
}
