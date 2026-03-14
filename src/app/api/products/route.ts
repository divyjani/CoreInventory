import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Product';
import Stock from '../../../models/Stock'; // For future stock computation

export async function GET() {
  try {
    await connectDB();

    // In the future, we could aggregate with the Stock collection to compute
    // the total onHand stock for each product. For now, we just return products.
    // Example: 
    // const productsWithStock = await Product.aggregate([ ... ]);
    
    const products = await Product.find({}).sort({ name: 1 }).lean();

    return NextResponse.json({ ok: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, sku, unitCost } = body;

    if (!name || !sku) {
      return NextResponse.json(
        { ok: false, error: 'Name and SKU are required' },
        { status: 400 }
      );
    }

    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return NextResponse.json(
        { ok: false, error: 'Product with this SKU already exists' },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      sku,
      unitCost: unitCost || 0,
    });

    return NextResponse.json({ ok: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
