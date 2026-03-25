import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const distDir = resolve(root, 'dist')
const clientDir = resolve(distDir, 'client')
const serverDir = resolve(distDir, 'server')
const pagesDir = resolve(distDir, 'pages')

const workerSource = `import app from './server/server.js'

const assetPattern = /\\.(?:css|gif|ico|jpg|jpeg|js|json|map|png|svg|txt|webmanifest|webp|woff|woff2)$/i

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/assets/') || assetPattern.test(url.pathname)) {
      return env.ASSETS.fetch(request)
    }

    const response = await app.fetch(request, env, ctx)

    if (response.status !== 404) {
      return response
    }

    return env.ASSETS.fetch(request)
  },
}
`

await rm(pagesDir, { force: true, recursive: true })
await mkdir(pagesDir, { recursive: true })

for (const entry of await readdir(clientDir)) {
  await cp(resolve(clientDir, entry), resolve(pagesDir, entry), {
    recursive: true,
  })
}

await cp(serverDir, resolve(pagesDir, 'server'), { recursive: true })
await writeFile(resolve(pagesDir, '_worker.js'), workerSource)
