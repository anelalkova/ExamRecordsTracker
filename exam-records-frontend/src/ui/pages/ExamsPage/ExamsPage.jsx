import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
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
import useSubject from "../../../hooks/useSubject.js";
import useExamsPaged from "../../../hooks/useExamsPaged.js";
import {formatDate, formatTime} from "../../../utils/Formatter/Formatter.js";
import examsRepository from "../../../repository/examsRepository.js";
import axiosInstance from "../../../axios/axios.js";

const ExamsPage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {subjectCode} = useParams();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const {examsPage, loading: examsLoading, error: examsError, refetch} = useExamsPaged(subjectCode, page, rowsPerPage);
    const {subject, loading: subjectLoading, error: subjectError} = useSubject(subjectCode);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event, exam) => {
        setAnchorEl(event.currentTarget);
        setSelectedExam(exam);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedExam(null);
    };

    const handleRegisterForExam = async (examId) => {
        try {
            await examsRepository.register(examId, user.userId);
            setMessage('Successfully registered for exam!');
            setMessageType('success');
            refetch();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to register for exam');
            setMessageType('error');
        }
    };

    const handleExportRegistrations = async (examId) => {
        try {
            const response = await axiosInstance.get(`/csv/exams/${examId}/registrations/export`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `exam_${examId}_registrations.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setMessage('Registrations exported successfully!');
            setMessageType('success');
        } catch (error) {
            setMessage('Failed to export registrations');
            setMessageType('error');
        }
        handleMenuClose();
    };

    const handleImportAttendance = async (examId, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            await axiosInstance.post(`/csv/exams/${examId}/attendance/import`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setMessage('Attendance imported successfully!');
            setMessageType('success');
            refetch();
        } catch (error) {
            setMessage('Failed to import attendance');
            setMessageType('error');
        }
        handleMenuClose();
    };

    const handleFileInputChange = (event, examId) => {
        const file = event.target.files[0];
        if (file) {
            handleImportAttendance(examId, file);
        }
    };


    if (subjectLoading || examsLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress/>
        </Box>
    );
    if (subjectError) return <Typography color="error" align="center">{subjectError}</Typography>;
    if (examsError) return <Typography color="error" align="center">{examsError}</Typography>;

    const canEdit = user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_TEACHER");
    const isStudent = user.roles.includes("ROLE_STUDENT");

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">{subject.name}</Typography>
                {canEdit && (
                    <Button variant="contained" color="primary"
                            onClick={() => navigate(`/subjects/${subjectCode}/create-exam`)}>
                        Create Exam
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
                            <TableCell>Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Session</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {examsPage.content.length > 0 ? (
                            examsPage.content.map((exam, index) => (
                                <TableRow key={index}>
                                    <TableCell>{formatDate(exam.dateOfExam)}</TableCell>
                                    <TableCell>{formatTime(exam.startTime)}</TableCell>
                                    <TableCell>{formatTime(exam.endTime)}</TableCell>
                                    <TableCell>{exam.session.name}</TableCell>
                                    <TableCell align="center">
                                        {isStudent && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleRegisterForExam(exam.id)}
                                                sx={{ mr: 1 }}
                                            >
                                                Register
                                            </Button>
                                        )}
                                        {canEdit && (
                                            <IconButton
                                                onClick={(e) => handleMenuOpen(e, exam)}
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
                                <TableCell colSpan={5} align="center">No exams found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={examsPage.totalElements}
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
                <MenuItem onClick={() => handleExportRegistrations(selectedExam?.id)}>
                    <FileDownload sx={{ mr: 1 }} />
                    Export Registrations
                </MenuItem>
                <MenuItem>
                    <input
                        accept=".csv"
                        style={{ display: 'none' }}
                        id={`attendance-upload-${selectedExam?.id}`}
                        type="file"
                        onChange={(e) => handleFileInputChange(e, selectedExam?.id)}
                    />
                    <label htmlFor={`attendance-upload-${selectedExam?.id}`} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <FileUpload sx={{ mr: 1 }} />
                        Import Attendance
                    </label>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default ExamsPage;
