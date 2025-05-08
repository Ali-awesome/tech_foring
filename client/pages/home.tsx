// import { useEffect, useState } from "react";
// import PrivateRoute from "../components/PrivateRoute";
// import type { Job } from './api/jobs/data';
// import { useRouter } from "next/router";
// import {
//   Box,
//   Button,
//   Container,
//   Typography,
//   Card,
//   CardContent,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";

// export default function HomePage() {
//   const router = useRouter();
//   const [jobs, setJobs] = useState<Job[]>([]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/');
//       return;
//     }

//     const fetchJobs = async () => {
//       try {
//         const res = await fetch('/api/jobs', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await res.json();
//         if (res.ok) setJobs(data.jobs);
//       } catch {
//         router.push('/');
//       }
//     };

//     fetchJobs();
//   }, [router.query]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     router.push("/");
//   };

//   return (
//     <PrivateRoute>
//       <Container maxWidth="md">
//         <Box
//           mt={5}
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Typography variant="h4">Welcome to the Job Portal</Typography>
//           <Button variant="outlined" color="error" onClick={handleLogout}>
//             Logout
//           </Button>
//         </Box>

//         <Box mt={3}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => router.push("/create-job")}
//           >
//             Create Job
//           </Button>
//         </Box>

//         <Box mt={4}>
//           <Typography variant="h5" gutterBottom>
//             Available Jobs
//           </Typography>
//           <Grid container columns={12} spacing={3}>
//             {jobs.map((job) => (
//               <Grid
//                 key={job.id}
//                 sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}
//               >
//                 <Card>
//                   <CardContent>
//                     <Typography variant="h6">{job.title}</Typography>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       {job.company}
//                     </Typography>
//                     <Typography variant="body2" mt={1}>
//                       {job.description}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Container>
//     </PrivateRoute>
//   );
// }
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import PrivateRoute from "../components/PrivateRoute";
import type { Job } from "./api/jobs/data";

export default function HomePage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setJobs(data.jobs);
      } catch {
        router.push("/");
      }
    };

    fetchJobs();
  }, [router.query]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <PrivateRoute>
      <Container maxWidth="md">
        <Box
          mt={5}
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontWeight="bold">
            Welcome to Job Portal
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/create-job")}
          >
            + Create Job
          </Button>
        </Box>

        <Grid container spacing={3} columns={12}>
          {jobs.map((job) => (
            <Grid
              key={job.id}
              sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}
            >
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {job.company}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {job.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PrivateRoute>
  );
}
