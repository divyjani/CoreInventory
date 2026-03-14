import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Receipt from '../../../models/Receipt';
import ReceiptItem from '../../../models/ReceiptItem';

export async function GET() {
  try {
    await connectDB();
    const receipts = await Receipt.find({})
      .populate('warehouseId')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ ok: true, data: receipts });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { supplier, warehouseId, responsibleUser, scheduleDate, items, reference } = body;

    if (!supplier || !warehouseId || !responsibleUser || !scheduleDate || !items || !items.length) {
      return NextResponse.json({ ok: false, error: 'Missing required receipt fields or items' }, { status: 400 });
    }

    // Auto-generate reference if not provided
    let ref = reference;
    if (!ref) {
      const count = await Receipt.countDocuments();
      ref = `REC-${(count + 1).toString().padStart(5, '0')}`;
    }

    const receipt = await Receipt.create({
      reference: ref,
      supplier,
      warehouseId,
      responsibleUser,
      scheduleDate,
      status: 'draft'
    });

    const receiptItemsData = items.map((item: any) => ({
      receiptId: receipt._id,
      productId: item.productId,
      quantity: item.quantity
    }));

    await ReceiptItem.insertMany(receiptItemsData);

    return NextResponse.json({ ok: true, data: receipt }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
