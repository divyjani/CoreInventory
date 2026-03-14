import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../lib/mongodb';
import Receipt from '../../../../models/Receipt';
import ReceiptItem from '../../../../models/ReceiptItem';
import StockMove from '../../../../models/StockMove';
import Warehouse from '../../../../models/Warehouse';
import { upsertStock } from '../../../../utils/helpers';
import { verifyAdminToken } from '../../../../utils/auth';

export async function PUT(request: Request) {
  try {
    // 1. JWT Authentication Check
    try {
      verifyAdminToken(request);
    } catch (authErr: any) {
      return NextResponse.json({ ok: false, error: authErr.message }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { receiptId } = body;

    if (!receiptId) {
      return NextResponse.json({ ok: false, error: 'receiptId is required' }, { status: 400 });
    }

    const receipt = await Receipt.findById(receiptId);
    if (!receipt) {
      return NextResponse.json({ ok: false, error: 'Receipt not found' }, { status: 404 });
    }

    if (receipt.status === 'done') {
      return NextResponse.json({ ok: false, error: 'Receipt is already validated' }, { status: 400 });
    }

    const items = await ReceiptItem.find({ receiptId });
    if (!items || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Receipt has no items' }, { status: 400 });
    }

    const warehouse = await Warehouse.findById(receipt.warehouseId);
    if (!warehouse) {
      return NextResponse.json({ ok: false, error: 'Warehouse not found' }, { status: 400 });
    }

    let reference = receipt.reference;
    if (!reference || reference.startsWith('REC-')) {
      const count = await StockMove.countDocuments({ type: 'IN' });
      reference = `${warehouse.shortCode}/IN/${(count + 1).toString().padStart(5, '0')}`;
      receipt.reference = reference;
    }

    // Try to use a transaction if supported by the MongoDB deployment (requires replica set)
    let session: mongoose.ClientSession | null = null;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
    } catch (e) {
      console.warn("MongoDB transactions not supported, falling back to sequential execution.", e);
      session = null; 
    }

    try {
      for (const item of items) {
        // Update stock
        await upsertStock(item.productId.toString(), receipt.warehouseId.toString(), item.quantity, 0, session);

        // Create Stock Move
        const stockMove = new StockMove({
          reference: receipt.reference,
          productId: item.productId,
          fromLocation: 'Partner Locations/Vendors',
          toLocation: `${warehouse.shortCode}/Stock`,
          quantity: item.quantity,
          type: 'IN',
          date: new Date(),
          status: 'done'
        });
        await stockMove.save({ session });
      }

      receipt.status = 'done';
      await receipt.save({ session });

      if (session) {
        await session.commitTransaction();
      }
    } catch (txError) {
      if (session) {
        await session.abortTransaction();
      }
      throw txError;
    } finally {
      if (session) {
        session.endSession();
      }
    }

    return NextResponse.json({ ok: true, data: receipt });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
