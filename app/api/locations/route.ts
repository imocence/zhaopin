
import { NextRequest, NextResponse } from 'next/server';
import { locationService } from '@/lib/services/cloudflare-db';
import { ensureDb } from '@/lib/db/ensure-db';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

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
        return NextResponse.json(successResponse(cities, '获取城市列表成功'));
      }
      const cities = await locationService.getAllCities();
      return NextResponse.json(successResponse(cities, '获取城市列表成功'));
    }

    if (stateCode) {
      const location = await locationService.getByState(stateCode);
      return NextResponse.json(successResponse(location, '获取地区信息成功'));
    }

    const locations = await locationService.getAll();
    return NextResponse.json(successResponse(locations, '获取地区列表成功'));
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch locations'),
      { status: 500 }
    );
  }
}
