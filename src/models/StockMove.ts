import mongoose, { Schema, Document } from 'mongoose';

export interface IStockMove extends Document {
  reference: string;
  productId: mongoose.Types.ObjectId;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  type: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  date: Date;
  status: string;
}

const StockMoveSchema: Schema = new Schema({
  reference: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'], required: true },
  date: { type: Date, required: true },
  status: { type: String, required: true },
});

export default mongoose.models.StockMove || mongoose.model<IStockMove>('StockMove', StockMoveSchema);
