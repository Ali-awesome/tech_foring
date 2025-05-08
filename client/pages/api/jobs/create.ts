import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { jobs } from './data';

const SECRET = 'your_jwt_secret_key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token' });

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, SECRET);

    const { title, company, description } = req.body;
    if (!title || !company || !description) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const newJob = {
      id: jobs.length + 1,
      title,
      company,
      description,
    };

    jobs.push(newJob);

    return res.status(201).json({ message: 'Job created', job: newJob });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
