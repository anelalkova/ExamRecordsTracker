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
    TablePagination
} from "@mui/material";
import useAuth from "../../../hooks/useAuth.js";
import useSubjectsPaged from "../../../hooks/useSubjectsPaged.js";
import {useNavigate} from "react-router-dom";

const SubjectsPage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const {subjectsPage, loading, error} = useSubjectsPaged(user.sub, user.roles, page, rowsPerPage);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Semester</TableCell>
                            <TableCell>Staff</TableCell>
                            {canEdit && <TableCell>Actions</TableCell>}
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
                                    {canEdit && (
                                        <TableCell>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={canEdit ? 6 : 5} align="center">
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
        </Box>
    );
};

export default SubjectsPage;
