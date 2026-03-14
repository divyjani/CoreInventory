import mongoose, { Schema, Document } from 'mongoose';

export interface IReceipt extends Document {
  reference: string;
  supplier: string;
  warehouseId: mongoose.Types.ObjectId;
  responsibleUser: string;
  scheduleDate: Date;
  status: 'draft' | 'ready' | 'done';
  createdAt: Date;
}

const ReceiptSchema: Schema = new Schema({
  reference: { type: String, required: true },
  supplier: { type: String, required: true },
  warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  responsibleUser: { type: String, required: true },
  scheduleDate: { type: Date, required: true },
  status: { type: String, enum: ['draft', 'ready', 'done'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', ReceiptSchema);
