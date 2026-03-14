import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Stock from '../../../models/Stock';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId');
    const productId = searchParams.get('productId');

    const query: any = {};
    if (warehouseId) query.warehouseId = warehouseId;
    if (productId) query.productId = productId;

    const stocks = await Stock.find(query)
      .populate('productId')
      .populate('warehouseId')
      .lean();

    // Map to include freeToUse dynamically if it wasn't strictly stored correctly previously
    const formattedStocks = stocks.map((s: any) => ({
      ...s,
      freeToUse: s.onHand - s.reserved
    }));

    return NextResponse.json({ ok: true, data: formattedStocks });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, warehouseId, onHand = 0, reserved = 0 } = body;

    if (!productId || !warehouseId) {
      return NextResponse.json({ ok: false, error: 'productId and warehouseId are required' }, { status: 400 });
    }

    let stock = await Stock.findOne({ productId, warehouseId });

    if (stock) {
      stock.onHand = onHand;
      stock.reserved = reserved;
      stock.freeToUse = stock.onHand - stock.reserved;
      await stock.save();
    } else {
      stock = await Stock.create({
        productId,
        warehouseId,
        onHand,
        reserved,
        freeToUse: onHand - reserved,
      });
    }

    return NextResponse.json({ ok: true, data: stock }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
