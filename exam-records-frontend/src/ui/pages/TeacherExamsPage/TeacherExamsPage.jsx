import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Chip,
    Box
} from '@mui/material';
import { GradingRounded, Visibility } from '@mui/icons-material';
import useTeacherExams from '../../../hooks/useTeacherExams.js';
import useAuth from '../../../hooks/useAuth.js';

const TeacherExamsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { exams, loading, error } = useTeacherExams(user?.userId);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Loading exams...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography color="error">Error: {error}</Typography>
            </Container>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getSessionColor = (sessionName) => {
        const colors = {
            'first_midterm': 'primary',
            'second_midterm': 'secondary',
            'january': 'success',
            'june': 'warning',
            'september': 'error'
        };
        return colors[sessionName] || 'default';
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    My Exams
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Manage exams for your subjects
                </Typography>
            </Box>

            {exams.length === 0 ? (
                <Card>
                    <CardContent sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No exams found
                        </Typography>
                        <Typography color="text.secondary">
                            You may need to be assigned to subjects first, or create new exams.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/subjects')}
                        >
                            View Subjects
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {exams.map((exam) => (
                        <Grid item xs={12} md={6} lg={4} key={exam.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="h6" component="h2" gutterBottom>
                                            {exam.subject.name}
                                        </Typography>
                                        <Chip
                                            label={exam.session.name}
                                            color={getSessionColor(exam.session.name)}
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Subject Code:</strong> {exam.subject.code}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Date:</strong> {formatDate(exam.dateOfExam)}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Time:</strong> {exam.startTime} - {exam.endTime}
                                    </Typography>

                                    {exam.subject.year && (
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            <strong>Year:</strong> {exam.subject.year}
                                        </Typography>
                                    )}

                                    {exam.subject.semester && (
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Semester:</strong> {exam.subject.semester}
                                        </Typography>
                                    )}
                                </CardContent>

                                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                    <Button
                                        size="small"
                                        startIcon={<Visibility />}
                                        onClick={() => navigate(`/teacher/exams/${exam.id}`)}
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<GradingRounded />}
                                        onClick={() => navigate(`/teacher/exams/${exam.id}/grade`)}
                                    >
                                        Grade
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default TeacherExamsPage;
