import type { NextApiRequest, NextApiResponse } from 'next';
import Category from '@/models/Category';
import {connectDB} from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    switch (req.method) {
        case 'GET':
            try {
                const categories = await Category.find().sort({ name: 1 });
                res.status(200).json(categories);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : 'invalid token';
                res.status(500).json({ message: errorMessage });
            }
            break;

        case 'POST':
            try {
                const { name } = req.body;

                if (!name) {
                    return res.status(400).json({ message: 'Category name is required' });
                }

                const existing = await Category.findOne({ name });
                if (existing) {
                    return res.status(409).json({ message: 'Category already exists' });
                }

                const category = await Category.create({ name });
                res.status(201).json(category);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : 'invalid token';
                res.status(500).json({ message: errorMessage});
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
