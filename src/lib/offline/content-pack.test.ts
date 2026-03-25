import { describe, expect, it } from 'vitest'
import { loadBundledContentPack } from '~/lib/content/repository'
import { parseContentPack } from '~/lib/content/validate-content-pack'
import {
  CONTENT_PACK_REQUEST,
  cacheBundledContentPack,
  getContentUpdateStatus,
  loadCachedOrBundledContentPack,
} from './content-pack'

const networkPack = parseContentPack({
  ...loadBundledContentPack(),
  version: '2026.03.26',
})

function createMemoryCacheStorage() {
  const values = new Map<string, Response>()

  return {
    async open(_cacheName?: string) {
      return {
        async match(request: Request | string) {
          return values.get(String(request))
        },
        async put(request: Request | string, response: Response) {
          values.set(String(request), response)
        },
      }
    },
  }
}

describe('content pack offline helpers', () => {
  it('caches and reloads the content pack for offline use', async () => {
    const cacheStorage = createMemoryCacheStorage()
    await cacheBundledContentPack({
      cacheStorage,
      fetchImpl: async () =>
        new Response(JSON.stringify(networkPack), {
          headers: { 'Content-Type': 'application/json' },
        }),
    })

    const loadedPack = await loadCachedOrBundledContentPack({ cacheStorage })
    expect(loadedPack.version).toBe('2026.03.26')
  })

  it('detects a newer content version explicitly', async () => {
    const cacheStorage = createMemoryCacheStorage()
    const cache = await cacheStorage.open('unused')
    await cache.put(
      CONTENT_PACK_REQUEST,
      new Response(
        JSON.stringify({
          ...networkPack,
          version: '2026.03.21',
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    )

    const status = await getContentUpdateStatus('2026.03.21', {
      cacheStorage,
      fetchImpl: async () =>
        new Response(JSON.stringify(networkPack), {
          headers: { 'Content-Type': 'application/json' },
        }),
    })

    expect(status).toEqual({
      cachedVersion: '2026.03.21',
      latestVersion: '2026.03.26',
      updateAvailable: true,
    })
  })
})
