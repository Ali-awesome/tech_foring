import mongoose, { Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
}

const CategorySchema = new mongoose.Schema<ICategory>({
    name: { type: String, required: true, unique: true }
});

const Category: Model<ICategory> =
    mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
