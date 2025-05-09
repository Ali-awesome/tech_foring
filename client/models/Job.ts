import mongoose, { Document, Model } from 'mongoose';

export interface IJob extends Document {
    title: string;
    description: string;
    min_age: number;
    max_age: number;
    min_yoe: number;
    skills: string[];
    requirements: string[];
    specifications: string[];
    educations: string;
    category: mongoose.Types.ObjectId; // Reference to Category
}

const JobSchema = new mongoose.Schema<IJob>({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    min_age: { type: Number, required: true },
    max_age: { type: Number, required: true },
    min_yoe: { type: Number, required: true },
    skills: { type: [String], required: true },
    requirements: { type: [String], required: true },
    specifications: { type: [String], required: true },
    educations: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

const JobModel: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
export default JobModel;
