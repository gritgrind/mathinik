import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { Activity, NumericInputContent } from '~/lib/content/types'
import { evaluateActivity } from '~/lib/evaluation/evaluate-activity'

type NumericInputActivityProps = {
  activity: Activity & { content: NumericInputContent }
}

export function NumericInputActivity({ activity }: NumericInputActivityProps) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isCorrect =
    submitted &&
    evaluateActivity(activity, {
      kind: 'numeric-input',
      value,
    }).correct

  return (
    <Card className="border-border/60 bg-card">
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
          Numeric input stays available as a short support check rather than a
          primary lesson mechanic.
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            className="h-12 min-w-32 rounded-2xl border border-border bg-background px-4 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
          <button
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            onClick={() => setSubmitted(true)}
            type="button"
          >
            Check answer
          </button>
        </div>
        <p>
          {!submitted
            ? 'Type a support answer to check it.'
            : isCorrect
              ? 'This support check is correct.'
              : 'Try another support answer.'}
        </p>
      </CardContent>
    </Card>
  )
}
