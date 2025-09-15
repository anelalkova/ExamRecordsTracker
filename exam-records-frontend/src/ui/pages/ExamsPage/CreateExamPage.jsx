import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    Grid,
    Alert,
    Autocomplete,
    Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth.js';
import examsRepository from '../../../repository/examsRepository.js';
import teacherRepository from '../../../repository/teacherRepository.js';

const CreateExamPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { subjectCode } = useParams();
    
    const [formData, setFormData] = useState({
        subjectCode: subjectCode || '',
        sessionId: '',
        dateOfExam: '',
        startTime: '',
        endTime: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const sessions = [
        { id: 1, name: 'First Midterm', value: 'first_midterm' },
        { id: 2, name: 'Second Midterm', value: 'second_midterm' },
        { id: 3, name: 'January Session', value: 'january' },
        { id: 4, name: 'June Session', value: 'june' },
        { id: 5, name: 'September Session', value: 'september' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const examData = {
                subjectCode: parseInt(formData.subjectCode),
                sessionId: parseInt(formData.sessionId),
                dateOfExam: formData.dateOfExam,
                startTime: formData.startTime,
                endTime: formData.endTime,
            };

            console.log('Sending exam data:', examData);

            if (user.roles.includes("ROLE_TEACHER")) {
                await teacherRepository.createExam(examData, user.userId);
            } else {
                await examsRepository.create(examData);
            }
            setSuccess('Exam created successfully!');
            
            setTimeout(() => {
                navigate(`/subjects/${subjectCode}/exams`);
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create exam');
        } finally {
            setLoading(false);
        }
    };

    const canCreate = user.roles.includes("ROLE_ADMIN") || user.roles.includes("ROLE_TEACHER");

    if (!canCreate) {
        return (
            <Box p={3}>
                <Alert severity="error">You don't have permission to create exams.</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Create New Exam
            </Typography>

            <Paper sx={{ p: 3, mt: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Subject Code"
                                value={formData.subjectCode}
                                onChange={(e) => handleInputChange('subjectCode', e.target.value)}
                                required
                                disabled={!!subjectCode}
                                type="number"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Session"
                                value={formData.sessionId}
                                onChange={(e) => handleInputChange('sessionId', e.target.value)}
                                required
                            >
                                {sessions.map((session) => (
                                    <MenuItem key={session.id} value={session.id}>
                                        {session.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Exam Date"
                                type="date"
                                value={formData.dateOfExam}
                                onChange={(e) => handleInputChange('dateOfExam', e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => handleInputChange('startTime', e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="End Time"
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => handleInputChange('endTime', e.target.value)}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}

                        {success && (
                            <Grid item xs={12}>
                                <Alert severity="success">{success}</Alert>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{ minWidth: 120 }}
                                >
                                    {loading ? 'Creating...' : 'Create Exam'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(-1)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateExamPage;

