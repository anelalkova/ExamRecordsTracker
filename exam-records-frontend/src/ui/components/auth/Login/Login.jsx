import React, {useState} from "react";
import {
    Box, 
    Button, 
    Container, 
    Paper, 
    TextField, 
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Link,
    Divider
} from "@mui/material";
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    LoginOutlined
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import userRepository from "../../../../repository/userRepository.js";
import useAuth from "../../../../hooks/useAuth.js";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await userRepository.login(formData);
            if (response.status === 200) {
                const loginData = response.data;
                login(loginData);
                
                if (loginData.requiresPasswordChange) {
                    navigate("/change-password", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box 
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2
            }}
        >
            <Container component="main" maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        borderRadius: 4,
                        px: 6,
                        py: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <LoginOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography component="h1" variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Sign in to access the Exam Records System
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />
                        
                        <Button 
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            size="large"
                            disabled={isLoading}
                            sx={{ 
                                mt: 2, 
                                mb: 3,
                                height: 56,
                                fontSize: '1.1rem',
                                fontWeight: 600
                            }}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Need Help?
                            </Typography>
                        </Divider>

                        <Box sx={{ textAlign: 'center' }}>
                            <Link 
                                href="#" 
                                variant="body2" 
                                sx={{ 
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/forgot-password');
                                }}
                            >
                                Forgot your password?
                            </Link>
                        </Box>
                        
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Students are registered by administrators.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;