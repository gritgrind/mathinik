import { EquationBuilderActivity } from '~/components/lesson/EquationBuilderActivity'
import { MultipleChoiceActivity } from '~/components/lesson/MultipleChoiceActivity'
import { NumericInputActivity } from '~/components/lesson/NumericInputActivity'
import { ObjectManipulationActivity } from '~/components/lesson/ObjectManipulationActivity'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type {
  Activity,
  EquationBuilderContent,
  MultipleChoiceContent,
  NumericInputContent,
  ObjectManipulationContent,
} from '~/lib/content/types'

type ActivityRendererProps = {
  activity: Activity
}

export function ActivityRenderer({ activity }: ActivityRendererProps) {
  switch (activity.type) {
    case 'object-manipulation':
      return <ObjectManipulationActivityCard activity={activity} />
    case 'equation-builder':
      return <EquationBuilderActivityCard activity={activity} />
    case 'multiple-choice':
      return <MultipleChoiceActivityCard activity={activity} />
    case 'numeric-input':
      return <NumericInputActivityCard activity={activity} />
    default:
      return <UnsupportedActivityCard activity={activity} />
  }
}

function ObjectManipulationActivityCard({ activity }: ActivityRendererProps) {
  if (activity.content.kind !== 'object-manipulation') {
    return <UnsupportedActivityCard activity={activity} />
  }

  return (
    <ObjectManipulationActivity
      activity={activity as Activity & { content: ObjectManipulationContent }}
    />
  )
}

function EquationBuilderActivityCard({ activity }: ActivityRendererProps) {
  if (activity.content.kind !== 'equation-builder') {
    return <UnsupportedActivityCard activity={activity} />
  }

  return (
    <EquationBuilderActivity
      activity={activity as Activity & { content: EquationBuilderContent }}
    />
  )
}

function MultipleChoiceActivityCard({ activity }: ActivityRendererProps) {
  if (activity.content.kind !== 'multiple-choice') {
    return <UnsupportedActivityCard activity={activity} />
  }

  return (
    <MultipleChoiceActivity
      activity={activity as Activity & { content: MultipleChoiceContent }}
    />
  )
}

function NumericInputActivityCard({ activity }: ActivityRendererProps) {
  if (activity.content.kind !== 'numeric-input') {
    return <UnsupportedActivityCard activity={activity} />
  }

  return (
    <NumericInputActivity
      activity={activity as Activity & { content: NumericInputContent }}
    />
  )
}

function UnsupportedActivityCard({ activity }: { activity: { type: string } }) {
  return (
    <RendererCard
      eyebrow="Unsupported activity"
      title={`Unsupported activity type: ${activity.type}`}
      tone="bg-destructive/10"
    >
      <p>Add a renderer before using this mechanic in the lesson runtime.</p>
    </RendererCard>
  )
}

function RendererCard({
  children,
  eyebrow,
  title,
  tone,
}: {
  children: React.ReactNode
  eyebrow: string
  title: string
  tone: string
}) {
  return (
    <Card className={`border-border/60 ${tone}`}>
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
        <CardTitle className="text-2xl font-black tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm leading-6 text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  )
}
