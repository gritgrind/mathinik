import { useMemo, useState } from 'react'

export function useForgivingPlacement<T extends number | string>() {
  const [activeItemId, setActiveItemId] = useState<T | null>(null)

  const helperText = useMemo(() => {
    if (activeItemId === null) {
      return 'Pick an item, then tap the target you want.'
    }

    return 'Tap a target to drop, or tap the same item again to cancel.'
  }, [activeItemId])

  function pickUpItem(itemId: T) {
    setActiveItemId((current) => (current === itemId ? null : itemId))
  }

  function placeIntoTarget(onPlace: (itemId: T) => void) {
    if (activeItemId === null) {
      return
    }

    onPlace(activeItemId)
    setActiveItemId(null)
  }

  function clearPlacement() {
    setActiveItemId(null)
  }

  return {
    activeItemId,
    clearPlacement,
    helperText,
    pickUpItem,
    placeIntoTarget,
  }
}
