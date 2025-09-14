import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Box,
    Card,
    CardContent,
    Alert,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Save, Check, ArrowBack, Edit, PersonRemove, PersonAdd } from '@mui/icons-material';
import useStudentGrading from '../../../hooks/useStudentGrading.js';
import useAuth from '../../../hooks/useAuth.js';
import examsRepository from '../../../repository/examsRepository.js';

const GradeStudentsPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { students, loading, error, assignGrade, refetch } = useStudentGrading(examId, user?.userId);

    const [gradeInputs, setGradeInputs] = useState({});
    const [savingStates, setSavingStates] = useState({});
    const [attendanceStates, setAttendanceStates] = useState({});
    const [alert, setAlert] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [editGrade, setEditGrade] = useState('');

    const handleGradeChange = (studentId, value) => {
        setGradeInputs(prev => ({
            ...prev,
            [studentId]: value
        }));
    };

    const handleSaveGrade = async (studentId) => {
        const grade = parseFloat(gradeInputs[studentId]);
        
        if (isNaN(grade) || grade < 5 || grade > 10) {
            setAlert({ type: 'error', message: 'Grade must be a number between 5 and 10 (5=failed, 6-10=passed)' });
            return;
        }

        setSavingStates(prev => ({ ...prev, [studentId]: true }));

        try {
            await assignGrade(studentId, grade);
            setGradeInputs(prev => ({ ...prev, [studentId]: '' }));
            setAlert({ type: 'success', message: 'Grade assigned successfully!' });
        } catch (err) {
            setAlert({ type: 'error', message: err.message });
        } finally {
            setSavingStates(prev => ({ ...prev, [studentId]: false }));
        }
    };

    const handleEditGrade = (student) => {
        setEditingStudent(student);
        setEditGrade(student.grade ? student.grade.toString() : '');
        setEditDialogOpen(true);
    };

    const handleUpdateGrade = async () => {
        const grade = parseFloat(editGrade);
        
        if (isNaN(grade) || grade < 5 || grade > 10) {
            setAlert({ type: 'error', message: 'Grade must be a number between 5 and 10 (5=failed, 6-10=passed)' });
            return;
        }

        try {
            await assignGrade(editingStudent.studentId, grade);
            setAlert({ type: 'success', message: 'Grade updated successfully!' });
            setEditDialogOpen(false);
        } catch (err) {
            setAlert({ type: 'error', message: err.message });
        }
    };

    const handleMarkAttendance = async (studentId) => {
        setAttendanceStates(prev => ({ ...prev, [studentId]: true }));
        
        try {
            await examsRepository.markAttendance(examId, studentId);
            setAlert({ type: 'success', message: 'Student marked as attended!' });
            refetch();
        } catch (err) {
            setAlert({ type: 'error', message: 'Failed to mark attendance' });
        } finally {
            setAttendanceStates(prev => ({ ...prev, [studentId]: false }));
        }
    };

    const handleUnmarkAttendance = async (studentId) => {
        setAttendanceStates(prev => ({ ...prev, [studentId]: true }));
        
        try {
            await examsRepository.unmarkAttendance(examId, studentId);
            setAlert({ type: 'success', message: 'Student marked as did not attend!' });
            refetch();
        } catch (err) {
            setAlert({ type: 'error', message: 'Failed to unmark attendance' });
        } finally {
            setAttendanceStates(prev => ({ ...prev, [studentId]: false }));
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Loading students...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button onClick={() => navigate('/teacher/exams')}>
                    Back to Exams
                </Button>
            </Container>
        );
    }

    const exam = students.length > 0 ? students[0] : null;
    const attendedStudents = students.filter(s => s.attended);
    const notAttendedStudents = students.filter(s => !s.attended);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/teacher/exams')}
                    sx={{ mb: 2 }}
                >
                    Back to Exams
                </Button>
                
                <Typography variant="h4" component="h1" gutterBottom>
                    Grade Students
                </Typography>
                
                {exam && (
                    <Typography variant="h6" color="text.secondary">
                        Exam ID: {examId}
                    </Typography>
                )}
            </Box>

            {alert && (
                <Alert 
                    severity={alert.type} 
                    sx={{ mb: 3 }}
                    onClose={() => setAlert(null)}
                >
                    {alert.message}
                </Alert>
            )}

            {students.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            No students registered for this exam
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Students Who Attended ({attendedStudents.length})
                            </Typography>
                            
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Student Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Index</TableCell>
                                            <TableCell>Current Grade</TableCell>
                                            <TableCell>Assign/Update Grade</TableCell>
                                            <TableCell>Actions</TableCell>
                                            <TableCell>Attendance</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {attendedStudents.map((student) => (
                                            <TableRow key={student.studentId}>
                                                <TableCell>{student.studentName}</TableCell>
                                                <TableCell>{student.studentEmail}</TableCell>
                                                <TableCell>{student.studentIndex || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {student.grade ? (
                                                        <Box>
                                                            <Chip 
                                                                label={`${student.grade}/10`}
                                                                color={student.grade >= 6 ? 'success' : 'error'}
                                                                size="small"
                                                            />
                                                            {student.gradedAt && (
                                                                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                                    Graded: {new Date(student.gradedAt).toLocaleDateString()}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    ) : (
                                                        <Chip label="Not Graded" color="default" size="small" />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        placeholder="5-10"
                                                        value={gradeInputs[student.studentId] || ''}
                                                        onChange={(e) => handleGradeChange(student.studentId, e.target.value)}
                                                        inputProps={{ min: 5, max: 10, step: 1 }}
                                                        helperText="5=Failed, 6-10=Passed"
                                                        sx={{ width: 120 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            startIcon={<Save />}
                                                            onClick={() => handleSaveGrade(student.studentId)}
                                                            disabled={
                                                                !gradeInputs[student.studentId] || 
                                                                savingStates[student.studentId]
                                                            }
                                                        >
                                                            {savingStates[student.studentId] ? 'Saving...' : 'Save'}
                                                        </Button>
                                                        
                                                        {student.grade && (
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditGrade(student)}
                                                                color="primary"
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="warning"
                                                        startIcon={<PersonRemove />}
                                                        onClick={() => handleUnmarkAttendance(student.studentId)}
                                                        disabled={attendanceStates[student.studentId]}
                                                        sx={{ minWidth: 'auto' }}
                                                    >
                                                        {attendanceStates[student.studentId] ? 'Updating...' : 'Did Not Attend'}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {notAttendedStudents.length > 0 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Students Who Did Not Attend ({notAttendedStudents.length})
                                </Typography>
                                
                                <TableContainer component={Paper} sx={{ mt: 2 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Student Name</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Index</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {notAttendedStudents.map((student) => (
                                                <TableRow key={student.studentId}>
                                                    <TableCell>{student.studentName}</TableCell>
                                                    <TableCell>{student.studentEmail}</TableCell>
                                                    <TableCell>{student.studentIndex || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label="Did not attend" 
                                                            color="warning" 
                                                            size="small" 
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="success"
                                                            startIcon={<PersonAdd />}
                                                            onClick={() => handleMarkAttendance(student.studentId)}
                                                            disabled={attendanceStates[student.studentId]}
                                                            sx={{ minWidth: 'auto' }}
                                                        >
                                                            {attendanceStates[student.studentId] ? 'Updating...' : 'Mark as Attended'}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Grade</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Grade (0-100)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={editGrade}
                        onChange={(e) => setEditGrade(e.target.value)}
                        inputProps={{ min: 0, max: 100, step: 0.5 }}
                    />
                    {editingStudent && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Student: {editingStudent.studentName}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateGrade} variant="contained">Update</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default GradeStudentsPage;
