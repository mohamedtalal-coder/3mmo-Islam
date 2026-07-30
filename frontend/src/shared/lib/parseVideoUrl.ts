/**
 * Parses a video URL (YouTube or Vimeo) and returns the embed URL.
 * Returns null if the URL is not a recognized video provider.
 *
 * To add support for more providers (e.g. Dailymotion, Wistia),
 * add a new block below following the same pattern:
 *   1. Match against the provider's URL patterns
 *   2. Extract the video ID
 *   3. Return the provider's embed URL with that ID
 */
export function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // ── YouTube ──────────────────────────────────────────────
    // Handles:
    //   https://www.youtube.com/watch?v=VIDEO_ID
    //   https://youtu.be/VIDEO_ID
    //   https://www.youtube.com/embed/VIDEO_ID  (already an embed)
    //   https://www.youtube.com/shorts/VIDEO_ID
    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be")
    ) {
      let videoId: string | null = null;

      if (parsed.hostname.includes("youtu.be")) {
        // Short URL: https://youtu.be/VIDEO_ID
        videoId = parsed.pathname.slice(1);
      } else if (parsed.pathname.startsWith("/embed/")) {
        // Already an embed URL – extract the ID anyway so we return a clean embed
        videoId = parsed.pathname.split("/embed/")[1]?.split(/[?/]/)[0] || null;
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1]?.split(/[?/]/)[0] || null;
      } else {
        // Standard watch URL
        videoId = parsed.searchParams.get("v");
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // ── Vimeo ────────────────────────────────────────────────
    // Handles:
    //   https://vimeo.com/VIDEO_ID
    //   https://vimeo.com/VIDEO_ID/PRIVACY_HASH  (unlisted videos)
    //   https://player.vimeo.com/video/VIDEO_ID  (already an embed)
    //   https://player.vimeo.com/video/VIDEO_ID?h=HASH
    if (
      parsed.hostname.includes("vimeo.com")
    ) {
      let videoId: string | null = null;
      let privacyHash: string | null = null;

      if (parsed.hostname === "player.vimeo.com") {
        videoId = parsed.pathname.split("/video/")[1]?.split(/[?/]/)[0] || null;
        privacyHash = parsed.searchParams.get("h");
      } else {
        // https://vimeo.com/123456789  or  https://vimeo.com/123456789/abc123
        const match = parsed.pathname.match(/^\/(\d+)(?:\/([a-zA-Z0-9]+))?/);
        if (match) {
          videoId = match[1];
          privacyHash = match[2] || null;
        }
      }

      if (videoId) {
        const hashParam = privacyHash ? `?h=${privacyHash}` : "";
        return `https://player.vimeo.com/video/${videoId}${hashParam}`;
      }
    }

    // ── Extend here for other providers ──────────────────────
    // Example for Dailymotion:
    // if (parsed.hostname.includes("dailymotion.com") || parsed.hostname.includes("dai.ly")) {
    //   ...extract videoId...
    //   return `https://www.dailymotion.com/embed/video/${videoId}`;
    // }

  } catch {
    // Invalid URL – fall through to return null
  }

  return null;
}

/**
 * Returns true if the URL appears to be a supported video provider link.
 */
export function isSupportedVideoUrl(url: string): boolean {
  return getVideoEmbedUrl(url) !== null;
}
