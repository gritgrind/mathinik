import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { Activity, MultipleChoiceContent } from '~/lib/content/types'
import { cn } from '~/lib/utils'

type MultipleChoiceActivityProps = {
  activity: Activity & { content: MultipleChoiceContent }
}

export function MultipleChoiceActivity({
  activity,
}: MultipleChoiceActivityProps) {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null)
  const isCorrect =
    selectedChoiceId !== null &&
    activity.content.correctChoiceIds.includes(selectedChoiceId)

  return (
    <Card className="border-border/60 bg-secondary/10">
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Support mechanic
        </p>
        <CardTitle className="text-2xl font-black tracking-tight">
          {activity.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          Use this quick check as a support format, not the main mechanic for
          the lesson.
        </p>
        <div className="grid gap-3">
          {activity.content.choices.map((choice) => (
            <button
              className={cn(
                'rounded-[1.5rem] border px-4 py-4 text-left text-sm font-semibold transition',
                selectedChoiceId === choice.id
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card text-foreground'
              )}
              key={choice.id}
              onClick={() => setSelectedChoiceId(choice.id)}
              type="button"
            >
              {choice.label}
            </button>
          ))}
        </div>
        <p>
          {selectedChoiceId === null
            ? 'Choose one answer.'
            : isCorrect
              ? 'This support check is correct.'
              : 'Try another support answer.'}
        </p>
      </CardContent>
    </Card>
  )
}
