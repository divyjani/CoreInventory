import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Warehouse from '../../../models/Warehouse';

export async function GET() {
  try {
    await connectDB();
    const warehouses = await Warehouse.find({}).lean();
    return NextResponse.json({ ok: true, data: warehouses });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, shortCode, address } = body;

    if (!name || !shortCode || !address) {
      return NextResponse.json({ ok: false, error: 'name, shortCode, and address are required' }, { status: 400 });
    }

    const warehouse = await Warehouse.create({ name, shortCode, address });
    return NextResponse.json({ ok: true, data: warehouse }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
