import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
  name: string;
  shortCode: string;
  address: string;
}

const WarehouseSchema: Schema = new Schema({
  name: { type: String, required: true },
  shortCode: { type: String, required: true },
  address: { type: String, required: true },
});

export default mongoose.models.Warehouse || mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
