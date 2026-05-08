import Mux from "@mux/mux-node";

/**
 * Mux server client — mirrors `lib/stripe.ts`. Lazy-singleton pattern so
 * importing this module never throws at build time even when env vars
 * aren't set; it only blows up if someone actually tries to call out.
 *
 * Set `MUX_TOKEN_ID` + `MUX_TOKEN_SECRET` in Vercel for this to work.
 * Generate a token at https://dashboard.mux.com/settings/access-tokens
 * with "Mux Video" read+write permissions.
 */
let _mux: Mux | null = null;

export function getMux(): Mux {
  if (!_mux) {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET must both be set");
    }
    _mux = new Mux({
      tokenId: process.env.MUX_TOKEN_ID,
      tokenSecret: process.env.MUX_TOKEN_SECRET,
    });
  }
  return _mux;
}

/** RTMPS ingest endpoint for Mux live streams. Used by OBS / studio software. */
export const MUX_RTMP_URL = "rtmps://global-live.mux.com:443/app";

export function isMuxConfigured(): boolean {
  return !!(process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET);
}
