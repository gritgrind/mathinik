import { useRegisterSW } from 'virtual:pwa-register/react'
import { buttonVariants } from '~/components/ui/button'

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
  })

  if (!offlineReady && !needRefresh) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(92vw,32rem)] -translate-x-1/2 rounded-[1.75rem] border border-border/70 bg-background/95 p-4 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">
          {offlineReady
            ? 'Mathinik is ready to work offline.'
            : 'A fresh app version is available.'}
        </p>
        <div className="flex flex-wrap gap-3">
          {needRefresh ? (
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
