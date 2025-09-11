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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import useAuth from '../../../hooks/useAuth.js';
import axiosInstance from '../../../axios/axios.js';

const RoomsPage = () => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        capacity: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const fetchRooms = async () => {
        try {
            const response = await axiosInstance.get('/rooms');
            setRooms(response.data);
        } catch (err) {
            setError('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleOpen = (room = null) => {
        setEditingRoom(room);
        setFormData({
            name: room?.name || '',
            capacity: room?.capacity?.toString() || ''
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRoom(null);
        setFormData({ name: '', capacity: '' });
    };

    const handleSubmit = async () => {
        try {
            const roomData = {
                name: formData.name,
                capacity: parseInt(formData.capacity)
            };

            if (editingRoom) {
                await axiosInstance.post(`/rooms/update/${editingRoom.id}`, roomData);
                setMessage('Room updated successfully!');
            } else {
                await axiosInstance.post('/rooms/create', roomData);
                setMessage('Room created successfully!');
            }
            
            setMessageType('success');
            handleClose();
            fetchRooms();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to save room');
            setMessageType('error');
        }
    };

    const canEdit = user.roles.includes("ROLE_ADMIN");

    if (!canEdit) {
        return (
            <Box p={3}>
                <Alert severity="error">You don't have permission to manage rooms.</Alert>
            </Box>
        );
    }

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Rooms Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                >
                    Add Room
                </Button>
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
                            <TableCell>Capacity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell>{room.name}</TableCell>
                                    <TableCell>{room.capacity}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleOpen(room)}
                                            size="small"
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    No rooms found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingRoom ? 'Edit Room' : 'Add New Room'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Room Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                        margin="normal"
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name || !formData.capacity}
                    >
                        {editingRoom ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RoomsPage;

