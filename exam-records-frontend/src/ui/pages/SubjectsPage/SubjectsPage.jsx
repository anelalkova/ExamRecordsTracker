import React, {useState} from "react";
import {
    CircularProgress,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Button,
    TablePagination,
    Alert,
    Menu,
    MenuItem,
    IconButton
} from "@mui/material";
import { MoreVert as MoreVertIcon, FileDownload, FileUpload } from "@mui/icons-material";
import useAuth from "../../../hooks/useAuth.js";
import useSubjectsPaged from "../../../hooks/useSubjectsPaged.js";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../../axios/axios.js";

const SubjectsPage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const {subjectsPage, loading, error} = useSubjectsPaged(user.sub, user.roles, page, rowsPerPage);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event, subject) => {
        setAnchorEl(event.currentTarget);
        setSelectedSubject(subject);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedSubject(null);
    };

    const handleExportStudents = async (subjectCode) => {
        try {
            const response = await axiosInstance.get(`/csv/subjects/${subjectCode}/students/export`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `subject_${subjectCode}_students.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setMessage('Students exported successfully!');
            setMessageType('success');
        } catch (error) {
            setMessage('Failed to export students');
            setMessageType('error');
        }
        handleMenuClose();
    };

    const handleImportStudents = async (subjectCode, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            await axiosInstance.post(`/csv/subjects/${subjectCode}/students/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setMessage('Students imported successfully!');
            setMessageType('success');
        } catch (error) {
            setMessage('Failed to import students');
            setMessageType('error');
        }
        handleMenuClose();
    };

    const handleFileInputChange = (event, subjectCode) => {
        const file = event.target.files[0];
        if (file) {
            handleImportStudents(subjectCode, file);
        }
    };

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress/>
        </Box>
    );

    if (error) return <Typography color="error" align="center" mt={4}>{error}</Typography>;

    const canEdit = user.roles.includes("ROLE_ADMIN");

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Subjects</Typography>
                {canEdit && (
                    <Button variant="contained" color="primary" onClick={() => navigate("/subjects/create")}>
                        Create Subject
                    </Button>
                )}
            </Box>

            {message && (
                <Alert severity={messageType} sx={{ mb: 2 }} onClose={() => setMessage('')}>
                    {message}
                </Alert>
            )}

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Semester</TableCell>
                            <TableCell>Staff</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjectsPage.content.length > 0 ? (
                            subjectsPage.content.map((subject) => (
                                <TableRow
                                    key={subject.code}
                                    hover
                                    sx={{cursor: "pointer"}}
                                    onClick={() => navigate(`/subjects/${subject.code}/exams`)}
                                >
                                    <TableCell>{subject.code}</TableCell>
                                    <TableCell>{subject.name}</TableCell>
                                    <TableCell>{subject.year}</TableCell>
                                    <TableCell>{subject.semester}</TableCell>
                                    <TableCell>
                                        {subject.subjectStaff.length > 0
                                            ? subject.subjectStaff.map((staff) => (
                                                <div key={staff.email}>
                                                    {staff.name} {staff.surname}
                                                </div>
                                            ))
                                            : <em>No staff assigned</em>}
                                    </TableCell>
                                    <TableCell align="center">
                                        {canEdit && (
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMenuOpen(e, subject);
                                                }}
                                                size="small"
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No subjects found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={subjectsPage.totalElements}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleExportStudents(selectedSubject?.code)}>
                    <FileDownload sx={{ mr: 1 }} />
                    Export Students
                </MenuItem>
                <MenuItem>
                    <input
                        accept=".csv"
                        style={{ display: 'none' }}
                        id={`student-upload-${selectedSubject?.code}`}
                        type="file"
                        onChange={(e) => handleFileInputChange(e, selectedSubject?.code)}
                    />
                    <label htmlFor={`student-upload-${selectedSubject?.code}`} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <FileUpload sx={{ mr: 1 }} />
                        Import Students
                    </label>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default SubjectsPage;
