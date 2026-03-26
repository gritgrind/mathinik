import { useRegisterSW } from 'virtual:pwa-register/react'
import { useState } from 'react'
import { buttonVariants } from '~/components/ui/button'

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
  })

  const [dismissed, setDismissed] = useState(false)
  const promptOverride =
    typeof window === 'undefined'
      ? undefined
      : window.__MATHINIK_TEST_SW_PROMPT__
  const effectiveOfflineReady = promptOverride?.offlineReady ?? offlineReady
  const effectiveNeedRefresh = promptOverride?.needRefresh ?? needRefresh
  const promptSignature = `${effectiveOfflineReady ? '1' : '0'}:${effectiveNeedRefresh ? '1' : '0'}`
  const [lastPromptSignature, setLastPromptSignature] =
    useState(promptSignature)

  if (lastPromptSignature !== promptSignature) {
    setLastPromptSignature(promptSignature)
    if (dismissed) {
      setDismissed(false)
    }
  }

  if ((!effectiveOfflineReady && !effectiveNeedRefresh) || dismissed) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(92vw,32rem)] -translate-x-1/2 rounded-[1.75rem] border border-border/70 bg-background/95 p-4 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">
          {effectiveOfflineReady
            ? 'Mathinik is ready to work offline.'
            : 'A fresh app version is available.'}
        </p>
        <div className="flex flex-wrap gap-3">
          {effectiveNeedRefresh ? (
            <button
              className={buttonVariants({ size: 'lg' })}
              onClick={() => updateServiceWorker(true)}
              type="button"
            >
              Reload app
            </button>
          ) : null}
          <button
            className={buttonVariants({ size: 'lg', variant: 'secondary' })}
            onClick={() => {
              setDismissed(true)
              setOfflineReady(false)
              setNeedRefresh(false)
            }}
            type="button"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
