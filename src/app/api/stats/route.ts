import { NextResponse } from 'next/server';
import { getLeagueLeaders } from '@/lib/api/nbaStats';

export async function GET() {
    try {
        const stats = await getLeagueLeaders();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('API Stats Error:', error);
        return NextResponse.json({ error: 'Failed to fetch league leaders' }, { status: 500 });
    }
}
