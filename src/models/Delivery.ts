import mongoose, { Schema, Document } from 'mongoose';

export interface IDelivery extends Document {
  reference: string;
  deliveryAddress: string;
  warehouseId: mongoose.Types.ObjectId;
  responsibleUser: string;
  scheduleDate: Date;
  operationType: string;
  status: 'draft' | 'waiting' | 'ready' | 'done';
  createdAt: Date;
}

const DeliverySchema: Schema = new Schema({
  reference: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  responsibleUser: { type: String, required: true },
  scheduleDate: { type: Date, required: true },
  operationType: { type: String, required: true },
  status: { type: String, enum: ['draft', 'waiting', 'ready', 'done'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Delivery || mongoose.model<IDelivery>('Delivery', DeliverySchema);
