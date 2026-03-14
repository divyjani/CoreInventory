import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  loginId: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  loginId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
