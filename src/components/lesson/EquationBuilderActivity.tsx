import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type {
  Activity,
  EquationBuilderContent,
  Token,
} from '~/lib/content/types'
import { cn } from '~/lib/utils'
import { useForgivingPlacement } from './useForgivingPlacement'

type EquationBuilderActivityProps = {
  activity: Activity & { content: EquationBuilderContent }
}

export function EquationBuilderActivity({
  activity,
}: EquationBuilderActivityProps) {
  const slotCount =
    activity.content.leftSide.length + activity.content.rightSide.length
  const [slotTokenIds, setSlotTokenIds] = useState<Array<string | null>>(
    Array.from({ length: slotCount }, () => null)
  )
  const { activeItemId, clearPlacement, helperText, pickUpItem } =
    useForgivingPlacement<string>()

  const tokensById = useMemo(
    () => new Map(activity.content.palette.map((token) => [token.id, token])),
    [activity.content.palette]
  )

  const isSolved = activity.content.validAnswers.some((answer) => {
    const left = slotTokenIds.slice(0, activity.content.leftSide.length)
    const right = slotTokenIds.slice(activity.content.leftSide.length)

    return arraysMatch(left, answer.left) && arraysMatch(right, answer.right)
  })

  function placeToken(slotIndex: number, tokenId: string) {
    setSlotTokenIds((currentSlots) => {
      const nextSlots = currentSlots.map((slotTokenId) =>
        slotTokenId === tokenId ? null : slotTokenId
      )
      nextSlots[slotIndex] = tokenId
      return nextSlots
    })
    clearPlacement()
  }

  function clearSlot(slotIndex: number) {
    setSlotTokenIds((currentSlots) => {
      const nextSlots = [...currentSlots]
      nextSlots[slotIndex] = null
      return nextSlots
    })
  }

  return (
    <Card className="border-border/60 bg-primary/10">
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Equation builder
        </p>
        <CardTitle className="text-2xl font-black tracking-tight">
          {activity.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 text-sm leading-6 text-muted-foreground">
        <div className="space-y-2">
          <p>{helperText}</p>
          <p>
            {isSolved
              ? 'Equation matches the content answer.'
              : 'Build the matching equation.'}
          </p>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <SlotRow
              label="Left side"
              offset={0}
              selectedTokenId={activeItemId}
              slotTokenIds={slotTokenIds.slice(
                0,
                activity.content.leftSide.length
              )}
              tokensById={tokensById}
              onClearSlot={clearSlot}
              onPlaceToken={placeToken}
            />
            <div className="hidden rounded-full border border-border/70 bg-background px-4 py-2 text-center text-sm font-bold text-foreground sm:block">
              =
            </div>
            <SlotRow
              label="Right side"
              offset={activity.content.leftSide.length}
              selectedTokenId={activeItemId}
              slotTokenIds={slotTokenIds.slice(
                activity.content.leftSide.length
              )}
              tokensById={tokensById}
              onClearSlot={clearSlot}
              onPlaceToken={placeToken}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Palette</p>
            <div className="flex flex-wrap gap-3">
              {activity.content.palette.map((token) => {
                const isUsed = slotTokenIds.includes(token.id)

                return (
                  <button
                    className={cn(
                      'min-h-12 rounded-2xl border px-4 py-3 text-sm font-semibold transition',
                      activeItemId === token.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground',
                      isUsed && 'opacity-55'
                    )}
                    data-token-id={token.id}
                    draggable
                    key={token.id}
                    onClick={() => pickUpItem(token.id)}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', token.id)
                      pickUpItem(token.id)
                    }}
                    type="button"
                  >
                    {token.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SlotRow({
  label,
  offset,
  selectedTokenId,
  slotTokenIds,
  tokensById,
  onClearSlot,
  onPlaceToken,
}: {
  label: string
  offset: number
  selectedTokenId: string | null
  slotTokenIds: Array<string | null>
  tokensById: Map<string, Token>
  onClearSlot: (slotIndex: number) => void
  onPlaceToken: (slotIndex: number, tokenId: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-3">
        {slotTokenIds.map((slotTokenId, index) => {
          const token = slotTokenId ? tokensById.get(slotTokenId) : null
          const slotIndex = offset + index

          return (
            <button
              className={cn(
                'flex min-h-14 min-w-20 items-center justify-center rounded-2xl border-2 border-dashed px-4 py-3 text-sm font-semibold transition',
                token
                  ? 'border-primary/60 bg-background text-foreground'
                  : 'border-border bg-card text-muted-foreground',
                selectedTokenId && !token && 'border-primary/60 bg-primary/5'
              )}
              data-slot-index={slotIndex}
              key={`${label}-${slotIndex}`}
              onClick={() => {
                if (token) {
                  onClearSlot(slotIndex)
                  return
                }

                if (selectedTokenId) {
                  onPlaceToken(slotIndex, selectedTokenId)
                }
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                const tokenId = event.dataTransfer.getData('text/plain')

                if (tokenId) {
                  onPlaceToken(slotIndex, tokenId)
                }
              }}
              type="button"
            >
              {token?.label ?? 'Drop here'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function arraysMatch(
  current: Array<string | null>,
  expected: string[]
): boolean {
  return current.every((value, index) => value === expected[index])
}
