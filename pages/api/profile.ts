import { NextApiRequest, NextApiResponse } from 'next';
import {verifyToken} from "@/lib/auth";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const payload = verifyToken(req);
        await connectDB();

        const user = await User.findById(payload.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ user });
    } catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
