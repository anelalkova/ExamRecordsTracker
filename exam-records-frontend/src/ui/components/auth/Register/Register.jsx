import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
} from "@mui/material";
import userRepository from "../../../../repository/userRepository.js";
import { useNavigate } from "react-router";
import useStudentPrograms from "../../../../hooks/useStudentPrograms.js";

const initialFormData = {
    name: "",
    surname: "",
    email: "",
    role: "",
    index: "",
    studentProgram: ""
};

const roles = ["ROLE_STUDENT", "ROLE_TEACHER", "ROLE_ADMIN"];

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { programs, loading: programsLoading, error: programsError } = useStudentPrograms();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!formData.name || !formData.surname || !formData.email || !formData.role) {
            setError("Please fill all required fields.");
            return;
        }

        if (formData.role === "ROLE_STUDENT" && !formData.studentProgram) {
            setError("Student Program is required for students.");
            return;
        }

        setLoading(true);
        try {
            await userRepository.create(formData);
            setSuccess("User registered successfully! An email with credentials was sent.");
            setFormData(initialFormData);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to register user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Register New User
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        margin="normal"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Surname"
                        name="surname"
                        margin="normal"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            label="Role"
                            required
                        >
                            {roles.map((r) => (
                                <MenuItem key={r} value={r}>
                                    {r.replace("ROLE_", "")}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {formData.role === "ROLE_STUDENT" && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Student Program</InputLabel>
                            <Select
                                name="studentProgram"
                                value={formData.studentProgram}
                                onChange={handleChange}
                                label="Student Program"
                                required
                            >
                                {programs.map((p) => (
                                    <MenuItem key={p.name} value={p.name}>
                                        {p.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <TextField
                        fullWidth
                        label="Index (Optional)"
                        name="index"
                        margin="normal"
                        value={formData.index}
                        onChange={handleChange}
                        disabled={formData.role !== "ROLE_STUDENT"}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </Paper>
            </Container>
        </>
    );
};

export default Register;
