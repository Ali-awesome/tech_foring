import type { NextApiRequest, NextApiResponse } from 'next';
import { users } from './users';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, phone, email, password } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ name, phone, email, password: hashedPassword });

  return res.status(201).json({ message: 'User registered successfully' });
}
