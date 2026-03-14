import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Delivery from '../../../models/Delivery';
import DeliveryItem from '../../../models/DeliveryItem';

export async function GET() {
  try {
    await connectDB();
    const deliveries = await Delivery.find({})
      .populate('warehouseId')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ ok: true, data: deliveries });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { reference, deliveryAddress, warehouseId, responsibleUser, scheduleDate, operationType, items } = body;

    if (!deliveryAddress || !warehouseId || !scheduleDate || !items || !items.length) {
      return NextResponse.json({ ok: false, error: 'Missing required delivery fields or items' }, { status: 400 });
    }

    let ref = reference;
    if (!ref) {
      const count = await Delivery.countDocuments();
      ref = `DEL-${(count + 1).toString().padStart(5, '0')}`;
    }

    const delivery = await Delivery.create({
      reference: ref,
      deliveryAddress,
      warehouseId,
      responsibleUser,
      scheduleDate,
      operationType,
      status: 'draft'
    });

    const deliveryItemsData = items.map((item: any) => ({
      deliveryId: delivery._id,
      productId: item.productId,
      quantity: item.quantity
    }));

    await DeliveryItem.insertMany(deliveryItemsData);

    return NextResponse.json({ ok: true, data: delivery }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
