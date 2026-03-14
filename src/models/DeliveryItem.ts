import mongoose, { Schema, Document } from 'mongoose';

export interface IDeliveryItem extends Document {
  deliveryId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

const DeliveryItemSchema: Schema = new Schema({
  deliveryId: { type: Schema.Types.ObjectId, ref: 'Delivery', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

export default mongoose.models.DeliveryItem || mongoose.model<IDeliveryItem>('DeliveryItem', DeliveryItemSchema);
