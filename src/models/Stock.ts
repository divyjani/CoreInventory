import mongoose, { Schema, Document } from 'mongoose';

export interface IStock extends Document {
  productId: mongoose.Types.ObjectId;
  warehouseId: mongoose.Types.ObjectId;
  onHand: number;
  reserved: number;
  freeToUse: number;
}

const StockSchema: Schema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  onHand: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },
  freeToUse: { type: Number, default: 0 },
});

export default mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema);
