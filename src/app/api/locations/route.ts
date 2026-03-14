import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Location from '../../../models/Location';
import Warehouse from '../../../models/Warehouse';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId');
    
    const query = warehouseId ? { warehouseId } : {};
    const locations = await Location.find(query).populate('warehouseId').lean();
    
    return NextResponse.json({ ok: true, data: locations });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, shortCode, warehouseId } = body;

    if (!name || !shortCode || !warehouseId) {
      return NextResponse.json({ ok: false, error: 'name, shortCode, and warehouseId are required' }, { status: 400 });
    }

    const warehouseExists = await Warehouse.findById(warehouseId);
    if (!warehouseExists) {
      return NextResponse.json({ ok: false, error: 'Warehouse not found' }, { status: 400 });
    }

    const location = await Location.create({ name, shortCode, warehouseId });
    return NextResponse.json({ ok: true, data: location }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
