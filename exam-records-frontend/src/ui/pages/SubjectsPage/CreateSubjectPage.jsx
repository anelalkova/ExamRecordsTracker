import React, { useEffect, useState } from "react";
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
    FormHelperText,
    Checkbox,
    ListItemText,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import subjectRepository from "../../../repository/subjectRepository.js";
import userRepository from "../../../repository/userRepository.js";
import { useNavigate, useParams } from "react-router-dom";

const semesters = ["Fall", "Spring"];

const SubjectFormPage = () => {
    const { code: subjectCode } = useParams(); // For update
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [semester, setSemester] = useState("");
    const [staffIds, setStaffIds] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]); // full objects
    const [staffList, setStaffList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Load all data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load staff and students first
                const [staffResponse, studentResponse] = await Promise.all([
                    userRepository.findByRole("ROLE_TEACHER"),
                    userRepository.findByRole("ROLE_STUDENT")
                ]);

                setStaffList(staffResponse.data);
                setStudentList(studentResponse.data);

                // If updating, load subject data after staff and students are loaded
                if (subjectCode) {
                    const subjectResponse = await subjectRepository.findById(subjectCode);
                    const s = subjectResponse.data;

                    console.log("Loaded subject data:", s);

                    setCode(s.code.toString());
                    setName(s.name);
                    setYear(s.year.toString());
                    setSemester(s.semester);

                    // Handle both possible data structures
                    if (s.staffIds) {
                        setStaffIds(s.staffIds);
                    } else if (s.subjectStaff) {
                        setStaffIds(s.subjectStaff.map(staff => staff.id));
                    }

                    // Handle both possible data structures for students
                    let selectedStudentObjects = [];
                    if (s.studentIds) {
                        selectedStudentObjects = studentResponse.data.filter(
                            student => s.studentIds.includes(student.id)
                        );
                    } else if (s.subjectStudents) {
                        selectedStudentObjects = s.subjectStudents.map(student =>
                            studentResponse.data.find(st => st.id === student.id)
                        ).filter(Boolean);
                    }

                    console.log("Selected students:", selectedStudentObjects);
                    setSelectedStudents(selectedStudentObjects);
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load data");
            }
        };

        loadData();
    }, [subjectCode]);

    const handleSubmit = async () => {
        if (!code || !name || !year || !semester) {
            setError("Please fill all required fields.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                code: Number(code),
                name,
                year: Number(year),
                semester,
                staffIds,
                studentIds: selectedStudents.map((s) => s.id),
            };

            console.log("Submitting payload:", payload);

            if (subjectCode) {
                await subjectRepository.update(subjectCode, payload);
            } else {
                await subjectRepository.add(payload);
            }

            navigate("/subjects");
        } catch (err) {
            console.error("Submit error:", err);
            setError(err.response?.data?.message || "Failed to submit.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", mt: 5, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
            <Typography variant="h4" mb={3}>
                {subjectCode ? "Update Subject" : "Create Subject"}
            </Typography>
            {error && <Typography color="error" mb={2}>{error}</Typography>}

            <TextField
                label="Code"
                type="number"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                disabled={!!subjectCode}
            />

            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />

            <TextField
                label="Year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                required
            />

            <FormControl fullWidth margin="normal" variant="outlined" error={!semester && error}>
                <InputLabel>Semester</InputLabel>
                <Select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    input={<OutlinedInput label="Semester" />}
                >
                    {semesters.map((s) => (
                        <MenuItem key={s} value={s}>
                            {s}
                        </MenuItem>
                    ))}
                </Select>
                {!semester && error && <FormHelperText>Semester is required</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Staff</InputLabel>
                <Select
                    multiple
                    value={staffIds}
                    onChange={(e) =>
                        setStaffIds(typeof e.target.value === "string" ? e.target.value.split(",").map(Number) : e.target.value)
                    }
                    input={<OutlinedInput label="Staff" />}
                    renderValue={(selected) =>
                        selected.map((id) => {
                            const staff = staffList.find((s) => s.id === id);
                            return staff ? `${staff.name} ${staff.surname}` : id;
                        }).join(", ")
                    }
                >
                    {staffList.map((staff) => (
                        <MenuItem key={staff.id} value={staff.id}>
                            <Checkbox checked={staffIds.includes(staff.id)} />
                            <ListItemText primary={`${staff.name} ${staff.surname}`} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <Autocomplete
                    multiple
                    options={studentList}
                    getOptionLabel={(option) => `${option.name} ${option.surname}`}
                    value={selectedStudents}
                    onChange={(event, newValue) => setSelectedStudents(newValue)}
                    renderInput={(params) => <TextField {...params} label="Students" variant="outlined" />}
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option.name} {option.surname}
                        </li>
                    )}
                />
            </FormControl>

            <Box mt={3} display="flex" justifyContent="space-between">
                <Button variant="outlined" onClick={() => navigate("/subjects")}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? (subjectCode ? "Updating..." : "Creating...") : subjectCode ? "Update Subject" : "Create Subject"}
                </Button>
            </Box>
        </Box>
    );
};

export default SubjectFormPage;