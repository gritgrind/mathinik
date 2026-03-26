import { useEffect, useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import {
  cacheBundledContentPack,
  getContentUpdateStatus,
  loadCachedOrBundledContentPack,
} from '~/lib/offline/content-pack'
import { preserveStateForContentPack } from '~/lib/offline/safe-refresh'
import { createBrowserStatePersistence } from '~/lib/state/store'

export function ContentPackStatus({
  currentVersion,
}: {
  currentVersion: string
}) {
  const [status, setStatus] = useState<
    'checking' | 'ready' | 'offline' | 'update-available'
  >('checking')
  const [cachedVersion, setCachedVersion] = useState<string | null>(null)
  const [latestVersion, setLatestVersion] = useState<string>(currentVersion)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function boot() {
      const testOverride =
        typeof window === 'undefined'
          ? undefined
          : window.__MATHINIK_TEST_CONTENT_STATUS__

      if (testOverride?.status) {
        setCachedVersion(testOverride.cachedVersion ?? null)
        setLatestVersion(testOverride.latestVersion ?? currentVersion)
        setStatus(testOverride.status)
        return
      }

      try {
        await cacheBundledContentPack()
        const nextStatus = await getContentUpdateStatus(currentVersion)

        if (!active) return

        setCachedVersion(nextStatus.cachedVersion)
        setLatestVersion(nextStatus.latestVersion)
        setStatus(nextStatus.updateAvailable ? 'update-available' : 'ready')
      } catch {
        if (!active) return
        setStatus('offline')
      }
    }

    void boot()

    return () => {
      active = false
    }
  }, [currentVersion])

  return (
    <div className="rounded-[1.5rem] border border-border/60 bg-background/75 p-4 text-sm leading-6 text-muted-foreground">
      <p className="font-semibold text-foreground">Offline content status</p>
      <p>
        {status === 'checking'
          ? 'Checking content cache...'
          : status === 'offline'
            ? 'Content cache is not ready yet in this environment.'
            : status === 'update-available'
              ? `A newer content pack is available: ${latestVersion}.`
              : `Content pack ${cachedVersion ?? currentVersion} is cached for offline use.`}
      </p>
      {message ? <p>{message}</p> : null}
      {status === 'update-available' ? (
        <button
          className={buttonVariants({ size: 'lg', variant: 'secondary' })}
          onClick={async () => {
            const persistence = createBrowserStatePersistence({
              contentVersion: currentVersion,
            })
            const nextPack = await loadCachedOrBundledContentPack()
            const loadedState = persistence.loadStateStore().state
            const safeState = preserveStateForContentPack(loadedState, nextPack)

            persistence.saveStateStore(safeState)
            setMessage(
              'Content refresh preserved local progress. Reload when ready to use the latest pack.'
            )
          }}
          type="button"
        >
          Apply safe refresh
        </button>
      ) : null}
    </div>
  )
}
