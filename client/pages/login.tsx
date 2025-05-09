import { useState } from "react";
import { useRouter } from "next/router";
import {
    Alert,
    Box,
    Button,
    Container,
    Snackbar,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";

export default function AuthPage() {
    const router = useRouter();
    const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
    const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        setForm({ name: "", phone: "", email: "", password: "" });
        setError("");
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, phone, email, password } = form;

        const endpoint = tab === 0 ? "/api/login" : "/api/register";
        const payload = tab === 0 ? { email, password } : { name, phone, email, password };

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message || "Something went wrong");
            }

            if (tab === 0) {
                router.push("/");
            } else {
                alert("Registration successful! You can now log in.");
                setTab(0);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            setShowError(true);
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
                                value={form.name}
                                onChange={handleChange("name")}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Phone"
                                value={form.phone}
                                onChange={handleChange("phone")}
                                required
                            />
                        </>
                    )}

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={form.password}
                        onChange={handleChange("password")}
                        required
                    />

                    {tab === 0 && (
                        <Typography variant="body2" color="textSecondary" mt={1}>
                            Not registered? Switch to the Register tab.
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
