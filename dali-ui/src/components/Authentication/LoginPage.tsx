import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, InputAdornment, Link, FormControl, InputLabel } from '@mui/material';
import { AccountCircle, Https } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { getApiUrl } from '../../config/apiConfig';
import logo from '../../assets/dali-logo.png';
import '../../scss/Login.scss';
import ForgotPassword from './ForgotPassword';

// Ensure API URL is set
if (!(window as any).API_URL) {
  (window as any).API_URL = getApiUrl();
}

interface LoginRequestDto {
  email: string;
  password: string;
}

interface AuthResponseDto {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  roles?: string[];
  tenantId?: string;
  tenantName?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  errors?: string[];
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: boolean;
  password: boolean;
  general?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({ email: false, password: false });

  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: FormData) => ({ ...prevData, [name]: value }));
    setFormErrors((prevErrors: FormErrors) => ({ ...prevErrors, [name]: false, general: undefined }));
  };

  const validateForm = () => {
    const errors = {
      email: formData.email === '',
      password: formData.password === ''
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const loginRequest: LoginRequestDto = {
        email: formData.email,
        password: formData.password
      };

      const response = await api.post<AuthResponseDto>('/Auth/login', loginRequest);

      if (response.data && response.data.success) {
        localStorage.setItem('refreshToken', response.data.refreshToken!);
        login(response.data.token!);
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || error.response.data || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server';
      } else {
        errorMessage = error.message || errorMessage;
      }

      setFormErrors((prev: FormErrors) => ({
        ...prev,
        general: errorMessage
      }));
    }
  };

  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="dali-login">
      <div className="dali-login-container">
        <Paper elevation={6} className="dali-login-paper">
          <img src={logo} alt="DALI Logo" className="dali-login-logo" />
          
          <Typography variant="h5" sx={{
            fontWeight: 600,
            textAlign: 'center',
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}>
            DALI LIOR - Login
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{
            textAlign: 'center',
            mb: 2,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}>
            COURSE Municipality of Zoeterwoude
          </Typography>

          <Box component="form" onSubmit={handleSubmit} className="dali-login-form">
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography component="label" htmlFor="email" sx={{ 
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 500,
                color: 'text.secondary',
                mb: 1,
                display: 'block'
              }}>
                Email Address
              </Typography>
              <TextField
                id="email"
                name="email"
                type="email"
                variant="outlined"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                helperText={formErrors.email ? 'Email is required' : ''}
                inputRef={emailRef}
                fullWidth
                size="small"
                className="dali-login-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <Typography component="label" htmlFor="password" sx={{ 
                fontSize: { xs: '14px', sm: '16px' },
                fontWeight: 500,
                color: 'text.secondary',
                mb: 1,
                display: 'block'
              }}>
                Password
              </Typography>
              <TextField
                id="password"
                name="password"
                type="password"
                variant="outlined"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                helperText={formErrors.password ? 'Password is required' : ''}
                fullWidth
                size="small"
                className="dali-login-input"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Https />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {formErrors.general && (
              <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
                {formErrors.general}
              </Typography>
            )}

            <Button 
              fullWidth 
              type="submit" 
              variant="contained"
              className="dali-login-button"
            >
              Login
            </Button>

            <div className="dali-login-links">
              <Link 
                href="#" 
                variant="body2" 
                onClick={handleOpen}
                className="dali-login-link"
              >
                Forgot Password?
              </Link>
              <Link 
                href="mailto:helpdesk@example.com" 
                variant="body2"
                className="dali-login-link"
              >
                Mail to DALI Helpdesk
              </Link>
            </div>
          </Box>
        </Paper>
      </div>
      <ForgotPassword open={open} handleClose={handleClose} />
    </div>
  );
};

export default LoginPage;