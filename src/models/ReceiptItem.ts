import mongoose, { Schema, Document } from 'mongoose';

export interface IReceiptItem extends Document {
  receiptId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

const ReceiptItemSchema: Schema = new Schema({
  receiptId: { type: Schema.Types.ObjectId, ref: 'Receipt', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.models.ReceiptItem || mongoose.model<IReceiptItem>('ReceiptItem', ReceiptItemSchema);
