import * as React from 'react';
import {cloneElement, useEffect, useMemo, useState} from 'react';
import Modal from '@mui/material/Modal';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import {Controller, useForm} from "react-hook-form";
import {ICategory} from "@/models/Category";

interface IProps {
    btnTitle?: string;
    action: "create" | "put" | "patch" | 'delete';
    btn?: React.ReactElement;
    jobId?: string;
    onSuccess: () => void;
}


type JobFormInputs = {
    category: string;
    title: string;
    description: string;
    min_age: number;
    max_age: number;
    min_yoe: number;
    skills: string;
    requirements: string;
    specifications: string;
    educations: string;
};
const CreateJobForm = React.memo(({onClose}: { onClose: () => void }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<JobFormInputs>();

    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchCategories();
    }, []);
    const createCategory = async (categoryName: string) => {
        try {
            setIsCreatingCategory(true);
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: categoryName}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create category');
            }

            setCategories(prev => [...prev, data]);
            setSuccess(true);
            return data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            return null;
        } finally {
            setIsCreatingCategory(false);
        }
    };
    const onSubmit = async (data: JobFormInputs) => {
        try {
            const categoryExists = categories.some(
                cat => cat.name.toLowerCase() === data.category.toLowerCase()
            );

            let categoryId = null;

            if (!categoryExists) {
                const newCategory = await createCategory(data.category);
                if (!newCategory) {
                    return; // If category creation failed, stop form submission
                }
                categoryId = newCategory._id;
            } else {
                categoryId = categories.find(
                    cat => cat.name.toLowerCase() === data.category.toLowerCase()
                )?._id;
            }

            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    category: categoryId,
                    skills: data.skills.split(',').map((s) => s.trim()),
                    requirements: data.requirements.split(',').map((s) => s.trim()),
                    specifications: data.specifications.split(',').map((s) => s.trim())
                })
            });

            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message || 'Something went wrong.');
            }

            setSuccess(true);
            reset();
            setTimeout(onClose, 1500);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
        }
    };


    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h5" mb={2}>Create a New Job</Typography>

            <Controller
                name="category"
                control={control}
                defaultValue=""
                rules={{required: 'Category is required'}}
                render={({field}) => (
                    <Autocomplete
                        {...field}
                        freeSolo
                        loading={isCreatingCategory}
                        options={categories.map((option) => option.name)}
                        onChange={(_, data) => field.onChange(data || '')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Category"
                                margin="normal"
                                error={!!errors.category}
                                helperText={errors.category?.message || 'Enter existing category or type a new one to create'}
                            />
                        )}
                    />
                )}
            />

            <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{required: 'Title is required'}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Job Title" margin="normal" error={!!errors.title}
                               helperText={errors.title?.message}/>
                )}
            />

            <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{required: 'Description is required'}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Description" margin="normal" multiline rows={4}
                               error={!!errors.description} helperText={errors.description?.message}/>
                )}
            />

            <Controller
                name="min_age"
                control={control}
                defaultValue={0}
                rules={{required: 'Min age is required', min: {value: 0, message: 'Min age must be ≥ 0'}}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Minimum Age" margin="normal" type="number"
                               error={!!errors.min_age} helperText={errors.min_age?.message}/>
                )}
            />

            <Controller
                name="max_age"
                control={control}
                defaultValue={0}
                rules={{required: 'Max age is required', min: {value: 0, message: 'Max age must be ≥ 0'}}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Maximum Age" margin="normal" type="number"
                               error={!!errors.max_age} helperText={errors.max_age?.message}/>
                )}
            />

            <Controller
                name="min_yoe"
                control={control}
                defaultValue={0}
                rules={{required: 'Experience is required'}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Minimum Years of Experience" margin="normal" type="number"
                               error={!!errors.min_yoe} helperText={errors.min_yoe?.message}/>
                )}
            />

            <Controller
                name="skills"
                control={control}
                defaultValue=""
                rules={{required: 'Skills are required'}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Skills (comma-separated)" margin="normal"
                               error={!!errors.skills} helperText={errors.skills?.message}/>
                )}
            />

            <Controller
                name="requirements"
                control={control}
                defaultValue=""
                rules={{required: 'Requirements are required'}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Requirements (comma-separated)" margin="normal"
                               error={!!errors.requirements} helperText={errors.requirements?.message}/>
                )}
            />

            <Controller
                name="specifications"
                control={control}
                defaultValue=""
                rules={{required: 'Specifications are required'}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Specifications (comma-separated)" margin="normal"
                               error={!!errors.specifications} helperText={errors.specifications?.message}/>
                )}
            />

            <Controller
                name="educations"
                control={control}
                defaultValue=""
                rules={{required: 'Education is required'}}
                render={({field}) => (
                    <TextField {...field} fullWidth label="Education" margin="normal" error={!!errors.educations}
                               helperText={errors.educations?.message}/>
                )}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 2}}>
                Submit Job
            </Button>

            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={2000}>
                <Alert severity="success">Job posted successfully!</Alert>
            </Snackbar>
        </Box>
    );
});

CreateJobForm.displayName = 'CreateJobForm';


const UpdateJobForm = React.memo(({jobId, onClose}: { jobId: string, onClose: () => void }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<JobFormInputs>();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error('Error loading categories', err);
            }
        };

        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${jobId}`);
                const job = await res.json();
                if (res.ok) {
                    const {skills, requirements, specifications, ...rest} = job;
                    reset({
                        ...rest,
                        skills: skills.join(', '),
                        requirements: requirements.join(', '),
                        specifications: specifications.join(', ')
                    });
                }
            } catch (err) {
                console.error('Failed to fetch job', err);
            }
        };

        fetchCategories();
        fetchJob();
    }, [jobId, reset]);

    const createCategory = async (name: string) => {
        try {
            setIsCreatingCategory(true);
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name})
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setCategories(prev => [...prev, data]);
            return data;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            return null;
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const onSubmit = async (data: JobFormInputs) => {
        try {
            const categoryExists = categories.some(
                cat => cat.name.toLowerCase() === data.category.toLowerCase()
            );

            let categoryId: unknown = null;
            if (!categoryExists) {
                const newCat = await createCategory(data.category);
                if (!newCat) return;
                categoryId = newCat._id;
            } else {
                categoryId = categories.find(
                    cat => cat.name.toLowerCase() === data.category.toLowerCase()
                )?._id || '';
            }

            const res = await fetch(`/api/jobs/${jobId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ...data,
                    category: categoryId,
                    skills: data.skills.split(',').map(s => s.trim()),
                    requirements: data.requirements.split(',').map(s => s.trim()),
                    specifications: data.specifications.split(',').map(s => s.trim())
                })
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            setSuccess(true);
            setTimeout(onClose, 1500);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h5" mb={2}>Update Job</Typography>

            {/* Form fields same as in CreateJobForm */}
            <Controller
                name="category"
                control={control}
                defaultValue=""
                rules={{required: 'Category is required'}}
                render={({field}) => (
                    <Autocomplete
                        {...field}
                        freeSolo
                        loading={isCreatingCategory}
                        options={categories.map((c) => c.name)}
                        onChange={(_, value) => field.onChange(value || '')}
                        renderInput={(params) => (
                            <TextField {...params} label="Category" margin="normal"
                                       error={!!errors.category}
                                       helperText={errors.category?.message}/>
                        )}
                    />
                )}
            />

            {['title', 'description', 'skills', 'requirements', 'specifications', 'educations'].map((fieldName) => (
                <Controller
                    key={fieldName}
                    name={fieldName as keyof JobFormInputs}
                    control={control}
                    defaultValue=""
                    rules={{required: `${fieldName} is required`}}
                    render={({field}) => (
                        <TextField {...field} fullWidth label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                                   margin="normal"
                                   error={!!errors[fieldName as keyof typeof errors]}
                                   helperText={errors[fieldName as keyof typeof errors]?.message}/>
                    )}
                />
            ))}

            <Controller
                name="min_age"
                control={control}
                defaultValue={0}
                rules={{required: true}}
                render={({field}) => (
                    <TextField {...field} type="number" fullWidth label="Minimum Age" margin="normal"
                               error={!!errors.min_age}
                               helperText={errors.min_age?.message}/>
                )}
            />

            <Controller
                name="max_age"
                control={control}
                defaultValue={0}
                rules={{required: true}}
                render={({field}) => (
                    <TextField {...field} type="number" fullWidth label="Maximum Age" margin="normal"
                               error={!!errors.max_age}
                               helperText={errors.max_age?.message}/>
                )}
            />

            <Controller
                name="min_yoe"
                control={control}
                defaultValue={0}
                rules={{required: true}}
                render={({field}) => (
                    <TextField {...field} type="number" fullWidth label="Min Years of Experience" margin="normal"
                               error={!!errors.min_yoe}
                               helperText={errors.min_yoe?.message}/>
                )}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 2}}>
                Update Job
            </Button>

            <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={2000}>
                <Alert severity="success">Job updated successfully!</Alert>
            </Snackbar>
        </Box>
    );
});
UpdateJobForm.displayName = 'CreateJobForm';

const FetchJobForm = React.memo(() => {
    return <Typography variant="h6">Fetch Form Placeholder</Typography>;
});
FetchJobForm.displayName = 'CreateJobForm';

const DeleteJob = React.memo(({jobId, onClose}: { jobId: string, onClose: () => void }) => {
    const [jobTitle, setJobTitle] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await fetch(`/api/jobs/${jobId}`);
                if (!res.ok) throw new Error('Failed to fetch job');
                const data = await res.json();
                setJobTitle(data.title);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const res = await fetch(`/api/jobs/${jobId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete job');
            onClose();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogContent>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={2}>
                        <CircularProgress/>
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Typography>
                        Are you sure you want to delete the job <strong>{jobTitle}</strong>?
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={deleting}>
                    Cancel
                </Button>
                <Button onClick={handleDelete} color="error" disabled={deleting || loading}>
                    {deleting ? <CircularProgress size={24}/> : 'Delete'}
                </Button>
            </DialogActions>
        </>
    );
});

DeleteJob.displayName = 'DeleteJob';
export default function CreateUpdateModal({btnTitle, action, btn, jobId, onSuccess}: IProps) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        onSuccess()
        setOpen(true)
    };
    const handleClose = () => {
        onSuccess()
        setOpen(false)
    };

    const renderForm = useMemo(() => {
        switch (action) {
            case 'create':
                return <CreateJobForm onClose={handleClose}/>;
            case 'put':
                return <UpdateJobForm jobId={jobId as string} onClose={handleClose}/>;
            case 'patch':
                return <FetchJobForm/>;
            case 'delete':
                return <DeleteJob jobId={jobId as string} onClose={handleClose}/>;
            default:
                return null;
        }
    }, [action]);

    return (
        <div>
            {btnTitle && <Button variant="contained" color="primary" onClick={handleOpen}>
                {btnTitle}
            </Button>}
            {btn && cloneElement(btn as React.ReactElement<{ onClick?: () => void }>, {
                onClick: handleOpen
            })}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    width: 500,
                }}>
                    {renderForm}
                </Box>
            </Modal>
        </div>
    );
}
