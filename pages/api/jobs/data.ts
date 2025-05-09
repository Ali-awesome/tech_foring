export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
}

export const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechForing Ltd",
    description: "Build interactive UIs using React and Material UI.",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "TechForing Ltd",
    description: "Design APIs and handle authentication with Node.js.",
  },
];
