import React, {useState, useEffect} from "react";
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
    LinearProgress,
    Chip
} from "@mui/material";
import {
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    SecurityOutlined,
    CheckCircle,
    Cancel
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import useAuth from "../../../hooks/useAuth.js";
import axiosInstance from "../../../axios/axios.js";

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    
    const navigate = useNavigate();
    const {user, requiresPasswordChange, markPasswordChanged, logout} = useAuth();

    useEffect(() => {
        if (!requiresPasswordChange) {
            navigate("/", { replace: true });
        }
    }, [requiresPasswordChange, navigate]);

    const validatePassword = (password) => {
        const validation = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };
        
        setPasswordValidation(validation);
        
        const strength = Object.values(validation).filter(Boolean).length;
        setPasswordStrength(strength);
        
        return Object.values(validation).every(Boolean);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        if (name === 'newPassword') {
            validatePassword(value);
        }
        
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match");
            setIsLoading(false);
            return;
        }

        if (!validatePassword(formData.newPassword)) {
            setError("Password does not meet security requirements");
            setIsLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/password/change', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });
            
            setSuccess("Password changed successfully! Redirecting...");
            markPasswordChanged();
            
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 2000);
            
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return 'error';
        if (passwordStrength <= 4) return 'warning';
        return 'success';
    };

    const getStrengthText = () => {
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 4) return 'Medium';
        return 'Strong';
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
            <Container component="main" maxWidth="md">
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
                        <SecurityOutlined sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
                        <Typography component="h1" variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                            Password Change Required
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            For your security, you must change your temporary password before continuing.
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="currentPassword"
                            label="Current Password"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={formData.currentPassword}
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
                                            onClick={() => togglePasswordVisibility('current')}
                                            edge="end"
                                        >
                                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={formData.newPassword}
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
                                            onClick={() => togglePasswordVisibility('new')}
                                            edge="end"
                                        >
                                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 1 }}
                        />

                        {formData.newPassword && (
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="body2" sx={{ mr: 2 }}>
                                        Password Strength:
                                    </Typography>
                                    <Chip 
                                        label={getStrengthText()} 
                                        color={getStrengthColor()}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(passwordStrength / 5) * 100}
                                    color={getStrengthColor()}
                                    sx={{ mb: 2, height: 6, borderRadius: 3 }}
                                />
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                                    {[
                                        { key: 'length', label: 'At least 8 characters' },
                                        { key: 'uppercase', label: 'Uppercase letter' },
                                        { key: 'lowercase', label: 'Lowercase letter' },
                                        { key: 'number', label: 'Number' },
                                        { key: 'special', label: 'Special character (!@#$%^&*)' },
                                    ].map(({ key, label }) => (
                                        <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
                                            {passwordValidation[key] ? (
                                                <CheckCircle sx={{ color: 'success.main', fontSize: 16, mr: 1 }} />
                                            ) : (
                                                <Cancel sx={{ color: 'error.main', fontSize: 16, mr: 1 }} />
                                            )}
                                            <Typography variant="caption" color={passwordValidation[key] ? 'success.main' : 'text.secondary'}>
                                                {label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm New Password"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            error={formData.confirmPassword && formData.newPassword !== formData.confirmPassword}
                            helperText={
                                formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                                    ? "Passwords do not match"
                                    : ""
                            }
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            edge="end"
                                        >
                                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                size="large"
                                disabled={isLoading || passwordStrength < 5 || formData.newPassword !== formData.confirmPassword}
                                sx={{ 
                                    height: 56,
                                    fontSize: '1.1rem',
                                    fontWeight: 600
                                }}
                            >
                                {isLoading ? 'Changing Password...' : 'Change Password'}
                            </Button>
                            
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={logout}
                                disabled={isLoading}
                                sx={{ 
                                    height: 56,
                                    minWidth: 120
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ChangePasswordPage;

