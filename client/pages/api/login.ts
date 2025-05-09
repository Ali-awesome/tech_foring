import type {NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {serialize} from 'cookie';
import {connectDB} from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = '7d';
const COOKIE_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required.'});
    }

    try {
        await connectDB();

        const user = await User.findOne({email});
        if (!user) return res.status(401).json({error: 'Invalid credentials.'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({error: 'Invalid credentials.'});

        const tokenPayload = {
            userId: user?._id.toString(),
            email: user.email,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        const cookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: COOKIE_EXPIRES_IN_SECONDS,
        });

        res.setHeader('Set-Cookie', cookie);
        res.status(200).json({message: 'Login successful.'});
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({error: 'Internal server error.'});
    }
}
