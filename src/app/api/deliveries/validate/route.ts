import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '../../../../lib/mongodb';
import Delivery from '../../../../models/Delivery';
import DeliveryItem from '../../../../models/DeliveryItem';
import StockMove from '../../../../models/StockMove';
import Warehouse from '../../../../models/Warehouse';
import Stock from '../../../../models/Stock';
import Product from '../../../../models/Product';
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
    const { deliveryId } = body;

    if (!deliveryId) {
      return NextResponse.json({ ok: false, error: 'deliveryId is required' }, { status: 400 });
    }

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return NextResponse.json({ ok: false, error: 'Delivery not found' }, { status: 404 });
    }

    if (delivery.status === 'done') {
      return NextResponse.json({ ok: false, error: 'Delivery is already validated' }, { status: 400 });
    }

    const items = await DeliveryItem.find({ deliveryId });
    if (!items || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Delivery has no items' }, { status: 400 });
    }

    const warehouse = await Warehouse.findById(delivery.warehouseId);
    if (!warehouse) {
      return NextResponse.json({ ok: false, error: 'Warehouse not found' }, { status: 400 });
    }

    // Pre-check for insufficient stock
    const insufficientStocks = [];
    for (const item of items) {
      const stock = await Stock.findOne({ productId: item.productId, warehouseId: delivery.warehouseId });
      const available = stock ? stock.freeToUse : 0;
      if (available < item.quantity) {
        const prod = await Product.findById(item.productId);
        insufficientStocks.push({ productId: item.productId, name: prod?.name || 'Unknown', available, requested: item.quantity });
      }
    }

    if (insufficientStocks.length > 0) {
      delivery.status = 'waiting';
      await delivery.save();
      return NextResponse.json({ 
        ok: false, 
        error: 'Insufficient stock', 
        insufficientStocks 
      }, { status: 400 });
    }

    let reference = delivery.reference;
    if (!reference || reference.startsWith('DEL-')) {
      const count = await StockMove.countDocuments({ type: 'OUT' });
      reference = `${warehouse.shortCode}/OUT/${(count + 1).toString().padStart(5, '0')}`;
      delivery.reference = reference;
    }

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
        // Decrease stock
        await upsertStock(item.productId.toString(), delivery.warehouseId.toString(), -item.quantity, 0, session);

        // Create Stock Move
        const stockMove = new StockMove({
          reference: delivery.reference,
          productId: item.productId,
          fromLocation: `${warehouse.shortCode}/Stock`,
          toLocation: 'Partner Locations/Customers',
          quantity: item.quantity,
          type: 'OUT',
          date: new Date(),
          status: 'done'
        });
        await stockMove.save({ session });
      }

      delivery.status = 'done';
      await delivery.save({ session });

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

    return NextResponse.json({ ok: true, data: delivery });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
