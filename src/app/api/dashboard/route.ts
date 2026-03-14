import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Product from '../../../models/Product';
import Stock from '../../../models/Stock';
import Receipt from '../../../models/Receipt';
import Delivery from '../../../models/Delivery';

export async function GET() {
  try {
    await connectDB();
    
    // Total Products
    const totalProducts = await Product.countDocuments();
    
    // Total Stock (aggregate matching freeToUse > 0)
    const stockAgg = await Stock.aggregate([
      { $group: { _id: null, totalOnHand: { $sum: "$onHand" } } }
    ]);
    const totalStock = stockAgg.length > 0 ? stockAgg[0].totalOnHand : 0;

    // Low Stock Items (simulated by finding stocks with onHand < 10)
    const lowStockItemsAgg = await Stock.aggregate([
      { $match: { onHand: { $lt: 10, $gt: 0 } } },
      { $group: { _id: "$productId" } }, // unique products
      { $count: "count" }
    ]);
    const lowStockItems = lowStockItemsAgg.length > 0 ? lowStockItemsAgg[0].count : 0;

    // Pending Receipts (not done)
    const pendingReceipts = await Receipt.countDocuments({ status: { $ne: 'done' } });

    // Pending Deliveries (not done)
    const pendingDeliveries = await Delivery.countDocuments({ status: { $ne: 'done' } });

    return NextResponse.json({
      ok: true,
      data: {
        totalProducts,
        lowStockItems,
        pendingReceipts,
        pendingDeliveries,
        totalStock
      }
    });

  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
