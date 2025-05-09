import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const { token } = parse(req.headers.cookie || '');

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(401).json({ error: 'User not found' });

        return res.status(200).json(user);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error
            ? err.message
            : 'invalid token';
        return res.status(401).json({ error: errorMessage });
    }
}
