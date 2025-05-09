import {useRouter} from "next/router";
import {useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import CreateUpdateModal from "@/components/CreateUpdateModal";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


interface Props {
    user: { email: string } | null;
    jobs: JobResponse[];
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

export default function HomePage({user, jobs}: Props) {

    const router = useRouter();
    const [jobsData, setJobsData] = useState<JobResponse[]>(jobs);
    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/jobs');
            if (!res.ok) throw new Error('Failed to fetch jobs');
            const data = await res.json();
            setJobsData(data);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        }
    };


    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', {method: 'POST'});

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Logout failed');
            }

            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
            alert('Logout failed. Please try again.');
        }
    };


    const jobsByCategory = jobsData.reduce((acc: Record<string, JobResponse[]>, job) => {
        const categoryId = job.category._id;

        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }

        acc[categoryId].push(job);
        return acc;
    }, {});

    const sortedCategories = Object.entries(jobsByCategory).sort((a, b) => {
        const categoryNameA = jobsData.find(job => job.category._id === a[0])?.category.name || '';
        const categoryNameB = jobsData.find(job => job.category._id === b[0])?.category.name || '';
        return categoryNameA.localeCompare(categoryNameB);
    });


    return (
        <Container maxWidth="md">
            <Box mt={5} mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight="bold">
                    Welcome {user?.email || 'Guest'}
                </Typography>
                {user ? (
                    <Button variant="outlined" color="error" onClick={handleLogout}>
                        Logout
                    </Button>
                ) : (
                    <Button variant="outlined" color="error" onClick={() => router.push("/login")}>
                        Login
                    </Button>
                )}
            </Box>

            <Box display="flex" justifyContent="flex-end" mb={3}>
                {user && <CreateUpdateModal action="create" btnTitle="+ Create Job" onSuccess={fetchJobs}/>}
            </Box>

            <Box mb={5}>
                <Typography variant="h5" gutterBottom>
                    Jobs by Category
                </Typography>

                {sortedCategories.map(([categoryId, categoryJobs]) => {
                    const categoryName = categoryJobs[0]?.category.name || 'Unknown Category';
                    return (
                        <Box key={categoryId}
                             sx={{
                                 backgroundColor: "#f5f5f5",
                                 borderRadius: 4,
                                 border: "2px solid #0009",
                                 mb: 1,
                                 '&:before': {
                                     display: 'none',
                                 },
                                 boxShadow: 0,
                                 overflow: 'hidden',
                             }}
                        >
                            <Accordion sx={{
                                backgroundColor: "#f5f5f5",
                            }} defaultExpanded={sortedCategories.length === 1}>
                                <AccordionSummary
                                    expandIcon={<UnfoldMoreIcon/>}
                                    aria-controls={`category-${categoryId}-content`}
                                    id={`category-${categoryId}-header`}
                                >
                                    <Typography fontWeight="bold">
                                        {categoryName} ({categoryJobs.length} jobs)
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List dense={true}>
                                        {categoryJobs.map((job) =>
                                            <ListItem sx={{
                                                backgroundColor: "white",
                                                borderBottom: '1px solid #f0f0f0',
                                                '&:last-child': {borderBottom: 'none'},
                                                my: 1,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                                      key={job.title}
                                                      disablePadding
                                            >

                                                <ListItemText sx={{p: 1}} id={job._id} primary={job.title}/>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => router.push(`/jobs/${job._id}`)}
                                                    sx={{minWidth: '100px', height: "100%"}}
                                                >
                                                    Apply Now
                                                </Button>
                                                {user && <CreateUpdateModal btn={<IconButton><EditIcon/></IconButton>}
                                                                            action="put" jobId={job._id}
                                                                            onSuccess={fetchJobs}/>}
                                                {user && <CreateUpdateModal btn={<IconButton><DeleteIcon/></IconButton>}
                                                                            action="delete" jobId={job._id}
                                                                            onSuccess={fetchJobs}/>}

                                            </ListItem>
                                        )}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    );
                })}

                {sortedCategories.length === 0 && (
                    <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
                        No jobs available. Create your first job!
                    </Typography>
                )}
            </Box>
        </Container>
    );
}