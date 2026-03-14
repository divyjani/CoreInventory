import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  shortCode: string;
  warehouseId: mongoose.Types.ObjectId;
}

const LocationSchema: Schema = new Schema({
  name: { type: String, required: true },
  shortCode: { type: String, required: true },
  warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
});

export default mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);
