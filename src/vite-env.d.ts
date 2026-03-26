/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface Window {
  __MATHINIK_TEST_SW_PROMPT__?: {
    offlineReady?: boolean
    needRefresh?: boolean
  }
  __MATHINIK_TEST_CONTENT_STATUS__?: {
    status?: 'checking' | 'ready' | 'offline' | 'update-available'
    cachedVersion?: string | null
    latestVersion?: string
  }
}
