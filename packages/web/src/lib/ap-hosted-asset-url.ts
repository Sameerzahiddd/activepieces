/**
 * Optional rewrite for assets hosted on cdn.activepieces.com (piece icons, videos, badges).
 * Set VITE_PIECE_CDN_BASE_URL to a mirror that keeps the same path suffix, e.g.
 *   https://cdn.otom8.us  →  https://cdn.otom8.us/pieces/slack.png
 * When unset, URLs stay on the upstream CDN (default).
 */
const AP_CDN_ORIGIN = 'https://cdn.activepieces.com';

export function apHostedAssetUrl(
  url: string | undefined | null,
): string | undefined {
  if (url == null || url === '') {
    return undefined;
  }
  const base = (
    import.meta.env.VITE_PIECE_CDN_BASE_URL as string | undefined
  )?.trim();
  if (!base) {
    return url;
  }
  const normalized = base.replace(/\/$/, '');
  if (url.startsWith(AP_CDN_ORIGIN)) {
    return normalized + url.slice(AP_CDN_ORIGIN.length);
  }
  return url;
}
