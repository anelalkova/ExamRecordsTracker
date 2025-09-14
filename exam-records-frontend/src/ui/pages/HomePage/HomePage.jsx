import React, { useEffect } from 'react';
import {
    Box, 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Button,
    Alert
} from "@mui/material";
import {
    School as SchoolIcon,
    Room as RoomIcon,
    Group as GroupIcon,
    Assignment as AssignmentIcon,
    PersonAdd as PersonAddIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth.js";

const HomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const isAdmin = user?.roles?.includes("ROLE_ADMIN");
    const isTeacher = user?.roles?.includes("ROLE_TEACHER");

    useEffect(() => {
        if (isTeacher && !isAdmin) {
            navigate('/teacher');
        }
    }, [isTeacher, isAdmin, navigate]);
    
    const adminCards = [
        {
            title: "Subjects Management",
            description: "Create and manage subjects, assign teachers, import/export students",
            icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            path: "/subjects",
            color: "#1976d2"
        },
        {
            title: "Rooms Management", 
            description: "Add and edit examination rooms with capacity settings",
            icon: <RoomIcon sx={{ fontSize: 40, color: 'success.main' }} />,
            path: "/rooms",
            color: "#2e7d32"
        },
        {
            title: "Users Management",
            description: "View all users, export/import students and teachers",
            icon: <GroupIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
            path: "/users", 
            color: "#ed6c02"
        },
        {
            title: "Register Students",
            description: "Register new students to the system",
            icon: <PersonAddIcon sx={{ fontSize: 40, color: 'error.main' }} />,
            path: "/admin/register-students",
            color: "#d32f2f"
        }
    ];

    return (
        <Box sx={{m:0, p:0}}>
            <Container maxWidth="xl" sx={{mt:3, py: 3}}>
                <Typography variant="h3" gutterBottom align="center" sx={{ mb: 2 }}>
                    📚 Exam Records Tracker
                </Typography>
                
                {isAdmin ? (
                    <>
                        <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 4 }}>
                            Admin Dashboard
                        </Typography>
                        
                        <Alert severity="info" sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Welcome, Admin! 👨‍💼
                            </Typography>
                            <Typography>
                                Get started by creating subjects, adding rooms, and importing users. 
                                Click on any subject to create exams and manage student registrations.
                            </Typography>
                        </Alert>

                        <Grid container spacing={3}>
                            {adminCards.map((card, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card 
                                        sx={{ 
                                            height: '100%', 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 6
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                            <Box sx={{ mb: 2 }}>
                                                {card.icon}
                                            </Box>
                                            <Typography variant="h6" component="h2" gutterBottom>
                                                {card.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {card.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                            <Button 
                                                variant="contained" 
                                                onClick={() => navigate(card.path)}
                                                sx={{ 
                                                    backgroundColor: card.color,
                                                    '&:hover': {
                                                        backgroundColor: card.color,
                                                        filter: 'brightness(0.9)'
                                                    }
                                                }}
                                            >
                                                Manage
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 6, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom align="center">
                                🚀 Quick Start Guide
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>
                                        1. Set up your system:
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        • Add rooms with capacity<br/>
                                        • Import or register users (students/teachers)<br/>
                                        • Create subjects and assign teachers
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>
                                        2. Manage exams:
                                    </Typography>
                                    <Typography variant="body2">
                                        • Click on subjects to create exams<br/>
                                        • Export student lists and import attendance<br/>
                                        • Track exam registrations
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                ) : (
                    <Box textAlign="center" sx={{ mt: 8 }}>
                        <SchoolIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Welcome to Exam Records Tracker
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Access your subjects and exams from the navigation menu above.
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default HomePage;