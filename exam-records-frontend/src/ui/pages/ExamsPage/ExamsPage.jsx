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
    TablePagination
} from "@mui/material";
import useAuth from "../../../hooks/useAuth.js";
import useSubject from "../../../hooks/useSubject.js";
import useExamsPaged from "../../../hooks/useExamsPaged.js";
import {formatDate, formatTime} from "../../../utils/Formatter/Formatter.js";

const ExamsPage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {subjectCode} = useParams();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {examsPage, loading: examsLoading, error: examsError} = useExamsPaged(subjectCode, page, rowsPerPage);
    const {subject, loading: subjectLoading, error: subjectError} = useSubject(subjectCode);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    if (subjectLoading || examsLoading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress/>
        </Box>
    );
    if (subjectError) return <Typography color="error" align="center">{subjectError}</Typography>;
    if (examsError) return <Typography color="error" align="center">{examsError}</Typography>;

    const canEdit = user.roles.includes("ROLE_ADMIN");

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

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Session</TableCell>
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
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No exams found.</TableCell>
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
        </Box>
    );
};

export default ExamsPage;
