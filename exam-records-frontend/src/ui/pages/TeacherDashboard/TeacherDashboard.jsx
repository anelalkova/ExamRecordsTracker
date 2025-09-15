import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { School, Assignment, GradingRounded, CalendarToday } from '@mui/icons-material';
import useTeacherExams from '../../../hooks/useTeacherExams.js';
import useAuth from '../../../hooks/useAuth.js';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { exams, loading } = useTeacherExams(user?.userId);

    React.useEffect(() => {
        console.log('TeacherDashboard - Current user:', user);
        console.log('TeacherDashboard - User roles:', user?.roles);
        console.log('TeacherDashboard - User ID:', user?.userId);
        console.log('TeacherDashboard - Exams:', exams);
    }, [user, exams]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Loading teacher dashboard...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
                Teacher Dashboard
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
                Welcome back, {user?.name} {user?.surname}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#e3f2fd' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Assignment sx={{ color: '#1976d2', mr: 1, fontSize: 30 }} />
                                <Typography variant="h6">
                                    My Exams
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ color: '#1976d2' }}>
                                {exams.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total exams under your supervision
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/teacher/exams')}>
                                View All Exams
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#e8f5e8' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <GradingRounded sx={{ color: '#388e3c', mr: 1, fontSize: 30 }} />
                                <Typography variant="h6">
                                    Grade Students
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Assign grades to students who attended your exams
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/teacher/exams')}>
                                Start Grading
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff3e0' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CalendarToday sx={{ color: '#f57c00', mr: 1, fontSize: 30 }} />
                                <Typography variant="h6">
                                    Create Exam
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Schedule new exams for your subjects
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/subjects')}>
                                Create Exam
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f3e5f5' }}>
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <School sx={{ color: '#7b1fa2', mr: 1, fontSize: 30 }} />
                                <Typography variant="h6">
                                    My Subjects
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                View subjects you're teaching
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => navigate('/subjects')}>
                                View Subjects
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Recent Exams
            </Typography>

            {exams.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                            No exams found. You may need to be assigned to subjects first.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {exams.slice(0, 6).map((exam) => (
                        <Grid item xs={12} sm={6} md={4} key={exam.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        {exam.subject.name}
                                    </Typography>
                                    <Typography color="text.secondary" gutterBottom>
                                        Session: {exam.session.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Date: {new Date(exam.dateOfExam).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Time: {exam.startTime} - {exam.endTime}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button 
                                        size="small" 
                                        onClick={() => navigate(`/teacher/exams/${exam.id}/grade`)}
                                    >
                                        Grade Students
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

export default TeacherDashboard;
