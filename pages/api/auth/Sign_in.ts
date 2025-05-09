import type { NextApiRequest, NextApiResponse } from 'next';
import { users } from './users';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = 'your_jwt_secret_key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) return res.status(401).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: '1h' });

  return res.status(200).json({ token });
}
