import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Alert,
    Chip,
    Menu,
    MenuItem,
    IconButton,
    Select,
    FormControl
} from '@mui/material';
import { 
    FileDownload, 
    FileUpload, 
    MoreVert as MoreVertIcon 
} from '@mui/icons-material';
import useAuth from '../../../hooks/useAuth.js';
import userRepository from '../../../repository/userRepository.js';
import useRoles from '../../../hooks/useRoles.js';
import axiosInstance from '../../../axios/axios.js';

const UsersPage = () => {
    const { user } = useAuth();
    const roles = useRoles();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await userRepository.findAll();
            setUsers(response.data);
        } catch (err) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleRoleChange = async (userId, newRoleId) => {
        try {
            await userRepository.updateUserRole(userId, newRoleId);
            setMessage('User role updated successfully!');
            setMessageType('success');
            await fetchUsers();
        } catch (error) {
            setMessage('Failed to update user role');
            setMessageType('error');
        }
    };

    const handleExportUsers = async () => {
        try {
            const response = await axiosInstance.get('/csv/users/export', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users_export.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setMessage('Users exported successfully!');
            setMessageType('success');
        } catch (error) {
            setMessage('Failed to export users');
            setMessageType('error');
        }
        handleMenuClose();
    };

    const handleExportUsersByRole = async (role) => {
        try {
            const response = await axiosInstance.get(`/csv/users/export/${role}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${role.toLowerCase()}s_export.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setMessage(`${role}s exported successfully!`);
            setMessageType('success');
        } catch (error) {
            setMessage(`Failed to export ${role}s`);
            setMessageType('error');
        }
        handleMenuClose();
    };

    const handleImportUsers = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            await axiosInstance.post('/csv/users/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setMessage('Users imported successfully!');
            setMessageType('success');
            fetchUsers();
        } catch (error) {
            setMessage('Failed to import users');
            setMessageType('error');
        }
        handleMenuClose();
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleImportUsers(file);
        }
    };

    const canEdit = user.roles.includes("ROLE_ADMIN");

    if (!canEdit) {
        return (
            <Box p={3}>
                <Alert severity="error">You don't have permission to manage users.</Alert>
            </Box>
        );
    }

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Users Management</Typography>
                <IconButton onClick={handleMenuOpen}>
                    <MoreVertIcon />
                </IconButton>
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
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Index</TableCell>
                            <TableCell>Program</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((userData) => (
                                <TableRow key={userData.id}>
                                    <TableCell>{userData.name} {userData.surname}</TableCell>
                                    <TableCell>{userData.email}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={userData.role.role.replace('ROLE_', '')} 
                                            variant="outlined"
                                            color={userData.role.role === 'ROLE_ADMIN' ? 'error' : 
                                                   userData.role.role === 'ROLE_TEACHER' ? 'warning' : 'primary'}
                                        />
                                    </TableCell>
                                    <TableCell>{userData.index || '-'}</TableCell>
                                    <TableCell>{userData.studentProgram?.name || '-'}</TableCell>
                                    <TableCell>
                                        <FormControl size="small" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={userData.role.id}
                                                onChange={(e) => handleRoleChange(userData.id, e.target.value)}
                                                displayEmpty
                                            >
                                                {roles.map((role) => (
                                                    <MenuItem key={role.id} value={role.id}>
                                                        {role.role.replace('ROLE_', '')}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleExportUsers}>
                    <FileDownload sx={{ mr: 1 }} />
                    Export All Users
                </MenuItem>
                <MenuItem onClick={() => handleExportUsersByRole('ROLE_STUDENT')}>
                    <FileDownload sx={{ mr: 1 }} />
                    Export Students
                </MenuItem>
                <MenuItem onClick={() => handleExportUsersByRole('ROLE_TEACHER')}>
                    <FileDownload sx={{ mr: 1 }} />
                    Export Teachers
                </MenuItem>
                <MenuItem>
                    <input
                        accept=".csv"
                        style={{ display: 'none' }}
                        id="users-upload"
                        type="file"
                        onChange={handleFileInputChange}
                    />
                    <label htmlFor="users-upload" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <FileUpload sx={{ mr: 1 }} />
                        Import Users
                    </label>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default UsersPage;

