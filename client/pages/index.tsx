import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

interface User {
  email: string;
  password: string;
  name: string;
  phone: string;
}

const users: User[] = [];

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/home");
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 0) {
      try {
        const res = await fetch("/api/auth/Sign_in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("token", data.token);
        alert("Login successful!");
        router.push("/home");
      } catch (err: any) {
        setError(err.message || "Login failed");
        setShowError(true);
      }
    } else {
      try {
        const res = await fetch("/api/auth/Sign_up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }

        alert("Registration successful!");
        setTab(0);
      } catch (err: any) {
        setError(err.message || "Registration failed");
        setShowError(true);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Typography variant="h5" mt={3} gutterBottom align="center">
          {tab === 0 ? "Login to your account" : "Create a new account"}
        </Typography>

        <form onSubmit={handleSubmit}>
          {tab === 1 && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {tab === 0 && (
            <Typography variant="body2" color="textSecondary" mt={1}>
              Not Registered? Go to the Register tab above.
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            {tab === 0 ? "Login" : "Register"}
          </Button>
        </form>
      </Box>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
