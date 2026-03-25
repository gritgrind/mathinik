import type { ContentPack } from '~/lib/content/types'
import { parseContentPack } from '~/lib/content/validate-content-pack'
import bundledPackJson from '../../../content/packs/mathinik-core-en.example.json'
import bundledPackUrl from '../../../content/packs/mathinik-core-en.example.json?url'

export const CONTENT_PACK_CACHE_NAME = 'mathinik-content-pack-v1'
export const CONTENT_PACK_REQUEST = bundledPackUrl

export type CacheLike = {
  match: (request: Request | string) => Promise<Response | undefined>
  put: (request: Request | string, response: Response) => Promise<void>
}

export type CacheStorageLike = {
  open: (cacheName: string) => Promise<CacheLike>
}

export type ContentUpdateStatus = {
  cachedVersion: string | null
  latestVersion: string
  updateAvailable: boolean
}

export async function cacheBundledContentPack(
  dependencies: {
    cacheStorage?: CacheStorageLike
    fetchImpl?: typeof fetch
  } = {}
) {
  const cacheStorage = dependencies.cacheStorage ?? getBrowserCacheStorage()
  const fetchImpl = dependencies.fetchImpl ?? fetch
  const cache = await cacheStorage.open(CONTENT_PACK_CACHE_NAME)
  const response = await fetchImpl(CONTENT_PACK_REQUEST, { cache: 'no-store' })

  await cache.put(CONTENT_PACK_REQUEST, response.clone())
  return parseContentPack(await response.json())
}

export async function loadCachedOrBundledContentPack(
  dependencies: { cacheStorage?: CacheStorageLike } = {}
): Promise<ContentPack> {
  const cacheStorage = dependencies.cacheStorage ?? getBrowserCacheStorage()
  const cache = await cacheStorage.open(CONTENT_PACK_CACHE_NAME)
  const cachedResponse = await cache.match(CONTENT_PACK_REQUEST)

  if (!cachedResponse) {
    return parseContentPack(bundledPackJson)
  }

  return parseContentPack(await cachedResponse.json())
}

export async function getContentUpdateStatus(
  currentVersion: string,
  dependencies: {
    cacheStorage?: CacheStorageLike
    fetchImpl?: typeof fetch
  } = {}
): Promise<ContentUpdateStatus> {
  const cacheStorage = dependencies.cacheStorage ?? getBrowserCacheStorage()
  const fetchImpl = dependencies.fetchImpl ?? fetch
  const cache = await cacheStorage.open(CONTENT_PACK_CACHE_NAME)
  const cachedResponse = await cache.match(CONTENT_PACK_REQUEST)
  const cachedVersion = cachedResponse
    ? parseContentPack(await cachedResponse.clone().json()).version
    : null
  const networkResponse = await fetchImpl(CONTENT_PACK_REQUEST, {
    cache: 'no-store',
  })
  const latestVersion = parseContentPack(await networkResponse.json()).version

  return {
    cachedVersion,
    latestVersion,
    updateAvailable: latestVersion !== currentVersion,
  }
}

function getBrowserCacheStorage(): CacheStorageLike {
  if (typeof caches === 'undefined') {
    throw new Error('Cache Storage is unavailable in this environment')
  }

  return caches
}
