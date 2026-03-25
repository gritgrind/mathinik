import bundledPackJson from '../../../content/packs/mathinik-core-en.example.json'
import type {
  Activity,
  ContentPack,
  ContentPackSummary,
  Grade,
  Lesson,
  Skill,
} from './types'
import { parseContentPack } from './validate-content-pack'

export type ContentRepository = {
  pack: ContentPack
  getContentVersion: () => string
  getSummary: () => ContentPackSummary
  getGrades: () => Grade[]
  getSkill: (skillId: string) => Skill | undefined
  getLesson: (lessonId: string) => Lesson | undefined
  getActivity: (lessonId: string, activityId: string) => Activity | undefined
}

export function createContentRepository(pack: ContentPack): ContentRepository {
  const skillById = new Map<string, Skill>()
  const lessonById = new Map<string, Lesson>()
  const activityByLessonId = new Map<string, Map<string, Activity>>()

  for (const grade of pack.grades) {
    for (const skill of grade.skills) {
      skillById.set(skill.id, skill)

      for (const lesson of skill.lessons) {
        lessonById.set(lesson.id, lesson)
        activityByLessonId.set(
          lesson.id,
          new Map(lesson.activities.map((activity) => [activity.id, activity]))
        )
      }
    }
  }

  const summary = getContentPackSummary(pack)

  return {
    pack,
    getContentVersion: () => pack.version,
    getSummary: () => summary,
    getGrades: () => pack.grades,
    getSkill: (skillId) => skillById.get(skillId),
    getLesson: (lessonId) => lessonById.get(lessonId),
    getActivity: (lessonId, activityId) =>
      activityByLessonId.get(lessonId)?.get(activityId),
  }
}

export function getContentPackSummary(pack: ContentPack): ContentPackSummary {
  const skillCount = pack.grades.reduce(
    (total, grade) => total + grade.skills.length,
    0
  )
  const lessons = pack.grades.flatMap((grade) =>
    grade.skills.flatMap((skill) => skill.lessons)
  )
  const activityCount = lessons.reduce(
    (total, lesson) => total + lesson.activities.length,
    0
  )

  return {
    packId: pack.packId,
    title: pack.title,
    version: pack.version,
    gradeCount: pack.grades.length,
    skillCount,
    lessonCount: lessons.length,
    activityCount,
  }
}

export function loadBundledContentPack(): ContentPack {
  return parseContentPack(bundledPackJson)
}

let bundledRepository: ContentRepository | undefined

export function getBundledContentRepository(): ContentRepository {
  bundledRepository ??= createContentRepository(loadBundledContentPack())
  return bundledRepository
}
