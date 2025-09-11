import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    InputLabel,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";
import userRepository from "../../../../repository/userRepository.js";
import { useNavigate } from "react-router";
import useStudentPrograms from "../../../../hooks/useStudentPrograms.js";

const initialFormData = {
    name: "",
    surname: "",
    email: "",
    password: "",
    repeatPassword: "",
    index: "",
    roleId: 1,
    studentProgramId: ""
};

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialFormData);

    const { programs, loading, error } = useStudentPrograms();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        userRepository
            .register(formData)
            .then(() => {
                setFormData(initialFormData);
                navigate("/login");
            })
            .catch((error) => {
                
            });
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Register
                </Typography>
                <Box>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        margin="normal"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Surname"
                        name="surname"
                        margin="normal"
                        required
                        value={formData.surname}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        margin="normal"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Repeat Password"
                        name="repeatPassword"
                        type="password"
                        margin="normal"
                        required
                        value={formData.repeatPassword}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Index"
                        name="index"
                        type="text"
                        margin="normal"
                        required
                        value={formData.index}
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Role"
                        name="roleId"
                        value={formData.roleId || ""}
                        onChange={handleChange}
                    >
                        <MenuItem value="" disabled>
                            Select a role
                        </MenuItem>
                        <MenuItem value={1}>Student</MenuItem>
                        <MenuItem value={2}>Teacher</MenuItem>
                        <MenuItem value={3}>Admin</MenuItem>
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Student Program"
                        name="studentProgramId"
                        value={formData.studentProgramId || ""}
                        onChange={handleChange}
                    >
                        <MenuItem value="" disabled>
                            Select a program
                        </MenuItem>
                        {programs.map((program) => (
                            <MenuItem key={program.id} value={program.id}>
                                {program.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
