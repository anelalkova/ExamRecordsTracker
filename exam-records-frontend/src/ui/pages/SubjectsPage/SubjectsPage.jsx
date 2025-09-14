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
    IconButton,
    Chip
} from "@mui/material";
import { MoreVert as MoreVertIcon, FileDownload, FileUpload, Edit, School } from "@mui/icons-material";
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
                            <TableCell>Assigned Staff</TableCell>
                            <TableCell>Students</TableCell>
                            <TableCell align="center">Management</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {subjectsPage.content.length > 0 ? (
                            subjectsPage.content.map((subject) => (
                                <TableRow key={subject.code} hover>
                                    <TableCell>
                                        <Chip
                                            label={subject.code}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="medium">
                                            {subject.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{subject.year}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={subject.semester}
                                            color={subject.semester === 'Spring' ? 'success' : 'info'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {subject.subjectStaff && subject.subjectStaff.length > 0 ? (
                                            <Box>
                                                {subject.subjectStaff.map((staff, index) => (
                                                    <Typography key={staff.email} variant="body2">
                                                        {staff.name} {staff.surname}
                                                        {index < subject.subjectStaff.length - 1 && ','}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                No staff assigned
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {subject.subjectStudents ? (
                                            <Chip
                                                label={`${subject.subjectStudents.length} enrolled`}
                                                color="secondary"
                                                size="small"
                                            />
                                        ) : (
                                            <Chip
                                                label="0 enrolled"
                                                color="default"
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" gap={1} justifyContent="center" alignItems="center">
                                            {/* Primary Action - Navigate to Exams */}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<School />}
                                                onClick={() => navigate(`/subjects/${subject.code}/exams`)}
                                                sx={{ minWidth: 'auto' }}
                                            >
                                                Exams
                                            </Button>

                                            {/* Secondary Action - Edit (only for admins) */}
                                            {canEdit && (
                                                <Button
                                                    variant="outlined"
                                                    color="warning"
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/subjects/${subject.code}/edit`);
                                                    }}
                                                    sx={{ minWidth: 'auto' }}
                                                >
                                                    Edit
                                                </Button>
                                            )}

                                            {/* Additional Actions Menu (only for admins) */}
                                            {canEdit && (
                                                <IconButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMenuOpen(e, subject);
                                                    }}
                                                    size="small"
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        '&:hover': { backgroundColor: 'action.hover' }
                                                    }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography variant="body1" color="text.secondary">
                                        No subjects found.
                                    </Typography>
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
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1.5,
                        minWidth: 180,
                    }
                }}
            >
                <MenuItem onClick={() => handleExportStudents(selectedSubject?.code)}>
                    <FileDownload sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="subtitle2">Export Students</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Download CSV file
                        </Typography>
                    </Box>
                </MenuItem>
                <MenuItem>
                    <input
                        accept=".csv"
                        style={{ display: 'none' }}
                        id={`student-upload-${selectedSubject?.code}`}
                        type="file"
                        onChange={(e) => handleFileInputChange(e, selectedSubject?.code)}
                    />
                    <label
                        htmlFor={`student-upload-${selectedSubject?.code}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        <FileUpload sx={{ mr: 2, color: 'success.main' }} />
                        <Box>
                            <Typography variant="subtitle2">Import Students</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Upload CSV file
                            </Typography>
                        </Box>
                    </label>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default SubjectsPage;