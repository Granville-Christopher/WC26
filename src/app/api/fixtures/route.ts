import { NextResponse } from "next/server";
import { getLiveMatches, FIFA_SCHEDULE_URL } from "@/lib/fixtures";
import { readStore, writeStore } from "@/lib/store";

export const revalidate = 3600;

export async function GET() {
  try {
    const [{ matches, syncedAt, source }, store] = await Promise.all([
      getLiveMatches(),
      readStore(),
    ]);

    return NextResponse.json({
      matches,
      syncedAt: store.lastFixtureSync ?? syncedAt,
      source,
      fifaReference: FIFA_SCHEDULE_URL,
      count: matches.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load fixtures" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const { matches, syncedAt, source } = await getLiveMatches();
    const store = await readStore();
    store.lastFixtureSync = syncedAt;
    await writeStore(store);

    return NextResponse.json({
      success: true,
      count: matches.length,
      syncedAt,
      source,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
