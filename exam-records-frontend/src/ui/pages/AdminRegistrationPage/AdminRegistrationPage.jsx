import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Alert,
    Grid,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import {
    Upload as UploadIcon,
    CloudUpload,
    CheckCircle,
    Error as ErrorIcon,
    Info as InfoIcon,
    PeopleAlt,
    FileDownload,
    Email
} from '@mui/icons-material';
import useAuth from '../../../hooks/useAuth.js';
import axiosInstance from '../../../axios/axios.js';
import { useNavigate } from 'react-router-dom';

const AdminRegistrationPage = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                setError('Please select a CSV file');
                return;
            }
            setFile(selectedFile);
            setError('');
            setResults(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosInstance.post('/admin/registration/students/csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResults(response.data);
            setShowResults(true);
            setFile(null);

            const fileInput = document.getElementById('csv-file-input');
            if (fileInput) fileInput.value = '';

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload and process CSV file');
        } finally {
            setUploading(false);
        }
    };

    const downloadSampleCsv = () => {
        const sampleData = [
            ['Name', 'Surname', 'Email', 'Index', 'Student Program'],
            ['John', 'Doe', 'john.doe@example.com', '123456', 'Софтверско Инженерство и Информациски Системи'],
            ['Jane', 'Smith', 'jane.smith@example.com', '654321', 'Компјутерски Науки']
        ];

        const csvContent = sampleData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sample_students.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const canRegister = user?.roles?.includes("ROLE_ADMIN");

    if (!canRegister) {
        return (
            <Box p={3}>
                <Alert severity="error">You don't have permission to register students.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                Student Registration
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Upload a CSV file to register multiple students at once
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigate('/users/create')}
                    sx={{ px: 4, py: 1.5 }}
                >
                    Register Single Student
                </Button>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card elevation={3}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <CloudUpload sx={{ mr: 2, color: 'primary.main' }} />
                                Upload Student Data
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            <Box
                                sx={{
                                    border: '2px dashed',
                                    borderColor: file ? 'success.main' : 'grey.300',
                                    borderRadius: 3,
                                    p: 4,
                                    textAlign: 'center',
                                    backgroundColor: file ? 'success.50' : 'grey.50',
                                    transition: 'all 0.3s ease',
                                    mb: 3
                                }}
                            >
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                    id="csv-file-input"
                                    disabled={uploading}
                                />
                                <label htmlFor="csv-file-input" style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
                                    <UploadIcon sx={{ fontSize: 48, color: file ? 'success.main' : 'grey.400', mb: 2 }} />
                                    <Typography variant="h6" sx={{ mb: 1 }}>
                                        {file ? file.name : 'Click to select CSV file'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {file ? `File size: ${(file.size / 1024).toFixed(2)} KB` : 'Drag and drop or click to browse'}
                                    </Typography>
                                </label>
                            </Box>

                            {uploading && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Processing students and sending credentials...
                                    </Typography>
                                    <LinearProgress />
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleUpload}
                                    disabled={!file || uploading}
                                    startIcon={<PeopleAlt />}
                                    sx={{ flexGrow: 1 }}
                                >
                                    {uploading ? 'Registering Students...' : 'Register Students'}
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={downloadSampleCsv}
                                    startIcon={<FileDownload />}
                                >
                                    Sample CSV
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
                                CSV Format Requirements
                            </Typography>

                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircle fontSize="small" color="success" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="CSV file with headers"
                                        secondary="Name, Surname, Email, Index, Student Program"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircle fontSize="small" color="success" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Valid email addresses"
                                        secondary="Each student needs a unique email"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircle fontSize="small" color="success" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Student program name"
                                        secondary="Must match existing programs"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <Email fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Automatic email sending"
                                        secondary="Students receive login credentials via email"
                                    />
                                </ListItem>
                            </List>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="body2" color="text.secondary">
                                <strong>Note:</strong> Each student will receive a randomly generated password
                                and must change it on first login for security.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog
                open={showResults}
                onClose={() => setShowResults(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                        Registration Results
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {results && (
                        <Box>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Successfully registered {results.length} students!
                                Each student has been sent their login credentials via email.
                            </Alert>

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Registered Students:
                            </Typography>

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Index</TableCell>
                                        <TableCell>Program</TableCell>
                                        <TableCell align="center">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {results.map((student, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{student.name} {student.surname}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.index || '-'}</TableCell>
                                            <TableCell>{student.studentProgram?.name || '-'}</TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label="Registered"
                                                    color="success"
                                                    size="small"
                                                    icon={<CheckCircle />}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowResults(false)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminRegistrationPage;

