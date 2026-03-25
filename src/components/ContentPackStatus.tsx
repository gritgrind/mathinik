import { useEffect, useState } from 'react'
import { buttonVariants } from '~/components/ui/button'
import {
  cacheBundledContentPack,
  getContentUpdateStatus,
} from '~/lib/offline/content-pack'

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

  useEffect(() => {
    let active = true

    async function boot() {
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
      {status === 'update-available' ? (
        <button
          className={buttonVariants({ size: 'lg', variant: 'secondary' })}
          onClick={() => window.location.reload()}
          type="button"
        >
          Refresh content
        </button>
      ) : null}
    </div>
  )
}
