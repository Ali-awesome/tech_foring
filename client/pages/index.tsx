import {GetServerSideProps} from "next";
import {parse} from "cookie";
import jwt from "jsonwebtoken";
import {connectDB} from "@/lib/db";
import JobModel, {IJob} from "@/models/Job";
import {ICategory} from "@/models/Category";
import mongoose from "mongoose";
import HomePage from "@/components/HomePage";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface Props {
    user: { email: string } | null;
    jobs: JobResponse[];
}

interface IPopulatedJob extends Omit<IJob, 'category'> {
    category: ICategory;
}


interface LeanJobDocument {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    min_age: number;
    max_age: number;
    min_yoe: number;
    skills: string[];
    requirements: string[];
    specifications: string[];
    educations: string;
    category: {
        _id: mongoose.Types.ObjectId;
        name: string;
    };
}

interface JobResponse {
    _id: string;
    title: string;
    description: string;
    min_age: number;
    max_age: number;
    min_yoe: number;
    skills: string[];
    requirements: string[];
    specifications: string[];
    educations: string;
    category: {
        _id: string;
        name: string;
    };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = parse(context.req.headers.cookie || '');
    const token = cookies.token || null;

    let user = null;
    let jobs: JobResponse[] = [];

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };
        user = {email: decoded.email};

        await connectDB();
        const jobDocs = await JobModel.find()
            .populate<IPopulatedJob>('category')
            .lean<LeanJobDocument[]>();
        jobs = jobDocs.map(job => ({
            ...job,
            _id: job._id.toString(),
            category: {
                ...job.category,
                _id: job.category._id.toString()
            }
        }));

    } catch (err) {
        console.error("Token verification failed:", err);
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {user, jobs},
    };
};

export default function Main({user, jobs}: Props) {
    return <HomePage user={user} jobs={jobs}/>
}