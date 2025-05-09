import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import PrivateRoute from '../components/PrivateRoute';

export default function CreateJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch('/api/jobs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, company, description }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || 'Something went wrong.');
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/home?new=1'), 1500);
  };

  return (
    <PrivateRoute>
      <Container maxWidth="sm">
        <Box mt={5} p={4} boxShadow={3} borderRadius={2}>
          <Typography variant="h5" mb={2}>Create a New Job</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Job Title"
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Company"
              margin="normal"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Submit Job
            </Button>
          </form>
        </Box>

        <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Snackbar open={success} autoHideDuration={2000}>
          <Alert severity="success">Job posted successfully!</Alert>
        </Snackbar>
      </Container>
    </PrivateRoute>
  );
}
