#!/usr/bin/env node

import fs from 'node:fs'

const googlePieces = [
  '@activepieces/piece-gmail',
  '@activepieces/piece-google-bigquery',
  '@activepieces/piece-google-calendar',
  '@activepieces/piece-google-cloud-storage',
  '@activepieces/piece-google-contacts',
  '@activepieces/piece-google-docs',
  '@activepieces/piece-google-drive',
  '@activepieces/piece-google-forms',
  '@activepieces/piece-google-my-business',
  '@activepieces/piece-google-search-console',
  '@activepieces/piece-google-sheets',
  '@activepieces/piece-google-slides',
  '@activepieces/piece-google-tasks',
  '@activepieces/piece-googlechat',
  '@activepieces/piece-youtube',
]

loadLocalEnv('.env.oauth.local')

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const disableCloudAuth = args.has('--disable-cloud-auth')
const apiUrl = (process.env.OTOM8_API_URL ?? 'https://app.otom8.us/api').replace(/\/$/, '')
const token = process.env.OTOM8_ADMIN_TOKEN
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET

if (!token || !clientId || !clientSecret) {
  console.error([
    'Missing required environment variables.',
    '',
    'Create ap/.env.oauth.local (it is gitignored) with:',
    '  OTOM8_ADMIN_TOKEN=...',
    '  GOOGLE_OAUTH_CLIENT_ID=...',
    '  GOOGLE_OAUTH_CLIENT_SECRET=...',
    '',
    'Then run:',
    '  node tools/scripts/upsert-google-oauth-apps.mjs --dry-run',
    '  node tools/scripts/upsert-google-oauth-apps.mjs --disable-cloud-auth',
    '',
    'Optional:',
    '  OTOM8_API_URL=https://app.otom8.us/api',
  ].join('\n'))
  process.exit(1)
}

if (!clientId.endsWith('.apps.googleusercontent.com')) {
  console.error('GOOGLE_OAUTH_CLIENT_ID does not look like a Google OAuth web client id.')
  process.exit(1)
}

if (dryRun) {
  console.log(`Would upsert ${googlePieces.length} Google OAuth apps at ${apiUrl}.`)
  console.log(`Would ${disableCloudAuth ? 'disable' : 'leave'} platform cloud OAuth fallback.`)
  googlePieces.forEach((pieceName) => console.log(`- ${pieceName}`))
  process.exit(0)
}

for (const pieceName of googlePieces) {
  const response = await fetch(`${apiUrl}/v1/oauth-apps`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      pieceName,
      clientId,
      clientSecret,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`Failed to upsert ${pieceName}: ${response.status} ${body}`)
    process.exitCode = 1
    continue
  }

  console.log(`Upserted ${pieceName}`)
}

if (disableCloudAuth) {
  const platformId = getPlatformIdFromJwt(token)
  if (!platformId) {
    console.error('Could not read platform id from OTOM8_ADMIN_TOKEN; cloud OAuth fallback was not changed.')
    process.exit(1)
  }

  const response = await fetch(`${apiUrl}/v1/platforms/${platformId}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      cloudAuthEnabled: false,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`Failed to disable cloud OAuth fallback: ${response.status} ${body}`)
    process.exit(1)
  }

  console.log('Disabled platform cloud OAuth fallback.')
}

function authHeaders() {
  return {
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  }
}

function loadLocalEnv(path) {
  if (!fs.existsSync(path)) {
    return
  }

  const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }
    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) {
      continue
    }
    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '')

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

function getPlatformIdFromJwt(jwt) {
  try {
    const payload = jwt.split('.')[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return decoded?.platform?.id
  }
  catch {
    return null
  }
}
