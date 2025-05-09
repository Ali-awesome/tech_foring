import jwt from 'jsonwebtoken';
import {NextApiRequest} from 'next';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthPayload {
    userId: string;
    email: string;
}

export function verifyToken(req: NextApiRequest): AuthPayload {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('No token');

    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
