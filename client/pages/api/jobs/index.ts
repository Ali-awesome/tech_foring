import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { jobs } from "./data";

const SECRET = "your_jwt_secret_key";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    return res.status(200).json({ jobs });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
