
import { NextRequest, NextResponse } from 'next/server';
import { locationService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';

// GET /api/locations - 获取地区列表
export async function GET(request: NextRequest) {
  try {
    await ensureDb(request);

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all'; // all, cities
    const stateCode = searchParams.get('stateCode') || undefined;

    if (type === 'cities') {
      if (stateCode) {
        const cities = await locationService.getCitiesByState(stateCode);
        return NextResponse.json({ data: cities });
      }
      const cities = await locationService.getAllCities();
      return NextResponse.json({ data: cities });
    }

    if (stateCode) {
      const location = await locationService.getByState(stateCode);
      return NextResponse.json({ data: location });
    }

    const locations = await locationService.getAll();
    return NextResponse.json({ data: locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
