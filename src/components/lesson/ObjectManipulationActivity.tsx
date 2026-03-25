import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { Activity, ObjectManipulationContent } from '~/lib/content/types'
import { cn } from '~/lib/utils'

type GroupId = 'source' | 'group-a' | 'group-b'

type ObjectManipulationActivityProps = {
  activity: Activity & { content: ObjectManipulationContent }
}

export function ObjectManipulationActivity({
  activity,
}: ObjectManipulationActivityProps) {
  const totalObjects = activity.content.scene.objects.reduce(
    (count, sceneObject) => count + sceneObject.count,
    0
  )
  const [assignments, setAssignments] = useState<GroupId[]>(
    Array.from({ length: totalObjects }, () => 'source')
  )
  const objectIds = useMemo(
    () =>
      Array.from({ length: totalObjects }, (_, index) => `apple-${index + 1}`),
    [totalObjects]
  )

  const groups = useMemo(() => getGroups(assignments), [assignments])
  const isSolved = activity.content.validAnswers.some((answer) => {
    const sortedGroupCounts = [groups['group-a'], groups['group-b']]
      .filter((count) => count > 0)
      .sort((left, right) => right - left)

    if (answer.expectedGroups) {
      return arraysMatch(
        sortedGroupCounts,
        [...answer.expectedGroups].sort((left, right) => right - left)
      )
    }

    if (answer.expectedCount !== undefined) {
      return groups['group-a'] + groups['group-b'] === answer.expectedCount
    }

    return false
  })

  return (
    <Card className="border-border/60 bg-accent/45">
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Object manipulation
        </p>
        <CardTitle className="text-2xl font-black tracking-tight">
          {activity.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm leading-6 text-muted-foreground">
        <div className="space-y-2">
          <p>{activity.content.task}</p>
          <p>
            Tap an apple to move it from the source into Group A, then Group B,
            then back to the source.
          </p>
          <p>
            {isSolved
              ? 'Groups match the content answer.'
              : 'Build the matching groups.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <GroupPanel label="Source" count={groups.source} tone="bg-background">
            <div className="flex flex-wrap gap-3">
              {assignments.map((assignment, index) =>
                assignment === 'source' ? (
                  <ObjectChip
                    key={`${objectIds[index]}-source`}
                    label={`Apple ${index + 1}`}
                    onClick={() =>
                      moveObject(index, assignments, setAssignments)
                    }
                  />
                ) : null
              )}
            </div>
          </GroupPanel>

          <GroupPanel
            label="Group A"
            count={groups['group-a']}
            tone="bg-primary/10"
          >
            <div className="flex flex-wrap gap-3">
              {assignments.map((assignment, index) =>
                assignment === 'group-a' ? (
                  <ObjectChip
                    key={`${objectIds[index]}-group-a`}
                    label={`Apple ${index + 1}`}
                    onClick={() =>
                      moveObject(index, assignments, setAssignments)
                    }
                  />
                ) : null
              )}
            </div>
          </GroupPanel>

          <GroupPanel
            label="Group B"
            count={groups['group-b']}
            tone="bg-secondary/10"
          >
            <div className="flex flex-wrap gap-3">
              {assignments.map((assignment, index) =>
                assignment === 'group-b' ? (
                  <ObjectChip
                    key={`${objectIds[index]}-group-b`}
                    label={`Apple ${index + 1}`}
                    onClick={() =>
                      moveObject(index, assignments, setAssignments)
                    }
                  />
                ) : null
              )}
            </div>
          </GroupPanel>
        </div>
      </CardContent>
    </Card>
  )
}

function GroupPanel({
  children,
  count,
  label,
  tone,
}: {
  children: React.ReactNode
  count: number
  label: string
  tone: string
}) {
  return (
    <div className={cn('rounded-[1.75rem] border border-border/60 p-4', tone)}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">{count}</p>
      </div>
      {children}
    </div>
  )
}

function ObjectChip({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      className="min-h-12 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/60"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

function moveObject(
  index: number,
  assignments: GroupId[],
  setAssignments: React.Dispatch<React.SetStateAction<GroupId[]>>
) {
  const currentGroup = assignments[index]
  const nextGroup =
    currentGroup === 'source'
      ? 'group-a'
      : currentGroup === 'group-a'
        ? 'group-b'
        : 'source'

  setAssignments((currentAssignments) => {
    const nextAssignments = [...currentAssignments]
    nextAssignments[index] = nextGroup
    return nextAssignments
  })
}

function getGroups(assignments: GroupId[]) {
  return assignments.reduce(
    (groups, assignment) => {
      groups[assignment] += 1
      return groups
    },
    {
      source: 0,
      'group-a': 0,
      'group-b': 0,
    }
  )
}

function arraysMatch(current: number[], expected: number[]) {
  return (
    current.length === expected.length &&
    current.every((value, index) => value === expected[index])
  )
}
