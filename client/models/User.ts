import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;
