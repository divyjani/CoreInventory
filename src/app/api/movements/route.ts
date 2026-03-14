import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import StockMove from '../../../models/StockMove';
import Product from '../../../models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    const query: any = {};
    if (productId) query.productId = productId;
    if (type) query.type = type;
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    const movements = await StockMove.find(query)
      .populate({ path: 'productId', model: Product, select: 'name sku' })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ ok: true, data: movements });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
