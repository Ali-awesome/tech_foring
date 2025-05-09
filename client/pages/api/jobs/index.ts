import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from "@/lib/db";
import JobModel, {IJob} from "@/models/Job";
import {ICategory} from "@/models/Category";
import mongoose from "mongoose";


interface IPopulatedJob extends Omit<IJob, 'category'> {
  category: ICategory;
}


interface LeanJobDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  min_age: number;
  max_age: number;
  min_yoe: number;
  skills: string[];
  requirements: string[];
  specifications: string[];
  educations: string;
  category: {
    _id: mongoose.Types.ObjectId;
    name: string;
  };
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      const jobDocs = await JobModel.find()
          .populate<IPopulatedJob>('category')
          .lean<LeanJobDocument[]>();
      const jobs = jobDocs.map(job => ({
        ...job,
        _id: job._id.toString(),
        category: {
          ...job.category,
          _id: job.category._id.toString()
        }
      }));
      return res.status(200).json(jobs);

    case 'POST':
      try {
        const job = await JobModel.create(req.body);
        return res.status(201).json(job);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error
            ? err.message
            : 'An unknown error occurred';
        return res.status(400).json({ error: errorMessage });
      }

    default:
      return res.status(405).end();
  }
}