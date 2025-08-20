import React, {useEffect, useState} from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Typography,
    FormHelperText
} from "@mui/material";
import subjectRepository from "../../../repository/subjectRepository.js";
import {useNavigate} from "react-router-dom";
import userRepository from "../../../repository/userRepository.js";

const semesters = ["Fall", "Spring"];

const CreateSubjectPage = () => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [semester, setSemester] = useState("");
    const [staffIds, setStaffIds] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        userRepository.findByRole("ROLE_TEACHER")
            .then(res => setStaffList(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = async () => {
        if (!code || !name || !year || !semester) {
            setError("Please fill all required fields.");
            return;
        }

        setLoading(true);
        try {
            await subjectRepository.add({
                code: Number(code),
                name,
                year: Number(year),
                semester,
                staffIds,
            });
            navigate("/subjects");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create subject.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{maxWidth: 600, margin: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2}}>
            <Typography variant="h4" mb={3}>Create Subject</Typography>

            {error && <Typography color="error" mb={2}>{error}</Typography>}

            <TextField
                label="Code"
                type="number"
                value={code}
                onChange={e => setCode(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />
            <TextField
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />
            <TextField
                label="Year"
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />

            <FormControl fullWidth margin="normal" variant="outlined" error={!semester && error}>
                <InputLabel>Semester</InputLabel>
                <Select
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    input={<OutlinedInput label="Semester"/>}
                    renderValue={(selected) => selected}
                >
                    {semesters.map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </Select>
                {!semester && error && <FormHelperText>Semester is required</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Staff</InputLabel>
                <Select
                    multiple
                    value={staffIds}
                    onChange={e => setStaffIds(typeof e.target.value === "string" ? e.target.value.split(',').map(Number) : e.target.value)}
                    input={<OutlinedInput label="Staff"/>}
                    renderValue={(selected) => selected
                        .map(id => {
                            const staff = staffList.find(s => s.id === id);
                            return staff ? `${staff.name} ${staff.surname}` : id;
                        })
                        .join(", ")
                    }
                >
                    {staffList.map(staff => (
                        <MenuItem key={staff.id} value={staff.id}>
                            {staff.name} {staff.surname}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={() => navigate("/subjects")}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Creating..." : "Create Subject"}
                </Button>
            </Box>
        </Box>
    );
};

export default CreateSubjectPage;
