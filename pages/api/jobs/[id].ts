import {NextApiRequest, NextApiResponse} from 'next';
import {connectDB} from "@/lib/db";
import JobModel from "@/models/Job";
import {ICategory} from "@/models/Category";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;

    await connectDB();

    try {
        switch (req.method) {
            case 'GET':
                const jobDoc = await JobModel.findById(id).populate<{ category: ICategory }>('category', 'name');
                if (!jobDoc) return res.status(404).json({error: 'Job not found'});

                const job = {
                    ...jobDoc.toObject(),
                    category: jobDoc.category?.name ?? null
                };
                return res.status(200).json(job);

            case 'PUT':
                const replaced = await JobModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
                if (!replaced) return res.status(404).json({error: 'Job not found'});
                return res.status(200).json(replaced);

            case 'PATCH':
                const updated = await JobModel.findByIdAndUpdate(id, {$set: req.body}, {
                    new: true,
                    runValidators: true
                });
                if (!updated) return res.status(404).json({error: 'Job not found'});
                return res.status(200).json(updated);

            case 'DELETE':
                const deleted = await JobModel.findByIdAndDelete(id);
                if (!deleted) return res.status(404).json({error: 'Job not found'});
                return res.status(204).end();

            default:
                return res.status(405).end();
        }
    } catch (err: unknown) {
        const errorMessage = err instanceof Error
            ? err.message
            : 'An unknown error occurred';
        return res.status(400).json({error: errorMessage});
    }
}
