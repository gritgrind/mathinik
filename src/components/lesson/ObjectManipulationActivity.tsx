import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { Activity, ObjectManipulationContent } from '~/lib/content/types'
import { evaluateActivity } from '~/lib/evaluation/evaluate-activity'
import { cn } from '~/lib/utils'
import { useForgivingPlacement } from './useForgivingPlacement'

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
  const { activeItemId, helperText, pickUpItem, placeIntoTarget } =
    useForgivingPlacement<number>()
  const objectIds = useMemo(
    () =>
      Array.from({ length: totalObjects }, (_, index) => `apple-${index + 1}`),
    [totalObjects]
  )

  const groups = useMemo(() => getGroups(assignments), [assignments])
  const isSolved = evaluateActivity(activity, {
    kind: 'object-manipulation',
    groupCounts: [groups['group-a'], groups['group-b']].filter(
      (count) => count > 0
    ),
    totalCount: groups['group-a'] + groups['group-b'],
  }).correct

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
          <p>{helperText}</p>
          <p>
            {isSolved
              ? 'Groups match the content answer.'
              : 'Build the matching groups.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <GroupPanel
            count={groups.source}
            label="Source"
            onDrop={() =>
              placeIntoTarget((itemIndex: number) =>
                moveObject(itemIndex, 'source', setAssignments)
              )
            }
            tone="bg-background"
          >
            <div className="flex flex-wrap gap-3">
              {assignments.map((assignment, index) =>
                assignment === 'source' ? (
                  <ObjectChip
                    active={activeItemId === index}
                    key={`${objectIds[index]}-source`}
                    label={`Apple ${index + 1}`}
                    onClick={() => pickUpItem(index)}
                  />
                ) : null
              )}
            </div>
          </GroupPanel>

          <GroupPanel
            label="Group A"
            count={groups['group-a']}
            onDrop={() =>
              placeIntoTarget((itemIndex: number) =>
                moveObject(itemIndex, 'group-a', setAssignments)
              )
            }
            tone="bg-primary/10"
          >
            <div className="flex flex-wrap gap-3">
              {assignments.map((assignment, index) =>
                assignment === 'group-a' ? (
                  <ObjectChip
                    active={activeItemId === index}
                    key={`${objectIds[index]}-group-a`}
                    label={`Apple ${index + 1}`}
                    onClick={() => pickUpItem(index)}
                  />
                ) : null
              )}
            </div>
          </GroupPanel>

          <GroupPanel
            label="Group B"
            count={groups['group-b']}
            onDrop={() =>
              placeIntoTarget((itemIndex: number) =>
                moveObject(itemIndex, 'group-b', setAssignments)
              )
            }
            tone="bg-secondary/10"
          >
            <div className="flex flex-wrap gap-3">
              {assignments.map((assignment, index) =>
                assignment === 'group-b' ? (
                  <ObjectChip
                    active={activeItemId === index}
                    key={`${objectIds[index]}-group-b`}
                    label={`Apple ${index + 1}`}
                    onClick={() => pickUpItem(index)}
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
  onDrop,
  tone,
}: {
  children: React.ReactNode
  count: number
  label: string
  onDrop: () => void
  tone: string
}) {
  return (
    <button
      className={cn(
        'rounded-[1.75rem] border border-border/60 p-4 text-left transition',
        tone
      )}
      onClick={onDrop}
      type="button"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">{count}</p>
      </div>
      {children}
    </button>
  )
}

function ObjectChip({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'min-h-12 rounded-full border px-4 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/60',
        active ? 'border-primary bg-primary/10' : 'border-border bg-card'
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

function moveObject(
  index: number,
  targetGroup: GroupId,
  setAssignments: React.Dispatch<React.SetStateAction<GroupId[]>>
) {
  setAssignments((currentAssignments) => {
    const nextAssignments = [...currentAssignments]
    nextAssignments[index] = targetGroup
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
