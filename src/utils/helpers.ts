import Stock from '../models/Stock';

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
}

export async function upsertStock(
  productId: string,
  warehouseId: string,
  deltaOnHand: number,
  deltaReserved: number = 0,
  session?: any
) {
  let stock = await Stock.findOne({ productId, warehouseId }).session(session || null);
  
  if (!stock) {
    stock = new Stock({
      productId,
      warehouseId,
      onHand: deltaOnHand,
      reserved: deltaReserved,
      freeToUse: deltaOnHand - deltaReserved,
    });
  } else {
    stock.onHand += deltaOnHand;
    stock.reserved += deltaReserved;
    stock.freeToUse = stock.onHand - stock.reserved;
  }
  
  await stock.save({ session });
  return stock;
}
