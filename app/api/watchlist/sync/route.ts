import { NextResponse } from 'next/server';
import { processSync } from '../../../../src/lib/watchlist/serverDb';
import { SyncPayloadSchema } from '../../../../src/lib/watchlist/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = SyncPayloadSchema.parse(body);
    
    // Process sync with LWW algorithm
    const mergedItems = processSync(payload.items);
    
    return NextResponse.json({ items: mergedItems });
  } catch (error) {
    console.error('Watchlist sync error:', error);
    return NextResponse.json({ error: 'Failed to sync watchlist' }, { status: 400 });
  }
}
