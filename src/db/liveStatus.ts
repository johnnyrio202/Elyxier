import "server-only";
import { getSql } from "./client";

export type LiveStatus = {
  instagramLive: boolean;
  tiktokLive: boolean;
};

export async function getLiveStatus(): Promise<LiveStatus> {
  const sql = getSql();
  const [row] = (await sql`SELECT instagram_live, tiktok_live FROM live_status WHERE id = true`) as Record<string, unknown>[];
  return {
    instagramLive: Boolean(row?.instagram_live),
    tiktokLive: Boolean(row?.tiktok_live),
  };
}

export async function updateLiveStatus(input: LiveStatus): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE live_status
    SET instagram_live = ${input.instagramLive}, tiktok_live = ${input.tiktokLive}
    WHERE id = true
  `;
}
