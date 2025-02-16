import { type FC, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  styled,
  PaperProps,
  TextFieldProps
} from '@mui/material';
import { Visibility, VisibilityOff, Lock as LockIcon } from '@mui/icons-material';
import logo from '../../assets/dali-logo.png';

const StyledPaper = styled(Paper)<PaperProps>(({ theme }) => ({
  padding: '32px',
  width: '100%',
  maxWidth: '450px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  margin: '16px',
  borderRadius: '12px',
  backgroundColor: '#ffffff'
}));

const PasswordRequirementsList = styled('ul')({
  marginTop: '8px',
  paddingLeft: '20px',
  listStyle: 'none',
  '& li': {
    marginBottom: '8px',
    position: 'relative',
    paddingLeft: '24px',
    '&:before': {
      content: '"•"',
      position: 'absolute',
      left: '0',
      color: '#666'
    }
  }
});

const StyledTextField = styled(TextField)<TextFieldProps>({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&:hover fieldset': {
      borderColor: '#d64b4b',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#d64b4b',
    }
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#d64b4b'
  }
});

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or missing reset information. Please request a new password reset link.');
    }
  }, [token, email]);

  const validatePassword = () => {
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/(?=.*[a-z])/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/(?=.*[A-Z])/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      setError('Password must contain at least one special character (@$!%*?&)');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    if (!token || !email) {
      setError('Invalid reset information');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/Auth/reset-password`, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          newPassword: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      if (response.ok) {
        navigate('/', { 
          state: { 
            message: 'Password reset successful. Please login with your new password.',
            email
          } 
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while resetting password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: e.target.value
    }));
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        backgroundColor: '#f5f5f5',
        overflow: 'auto'
      }}
    >
      <StyledPaper component="div" elevation={3}>
        <Box
          component="img"
          src={logo} 
          alt="DALI Logo" 
          sx={{ 
            width: '120px',
            marginBottom: '16px'
          }}
        />

        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom
          sx={{ 
            color: '#333',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Reset Password
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%',
              borderRadius: '8px'
            }}
            action={
              (!token || !email) && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => navigate('/login')}
                >
                  Return to Login
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}

        {token && email && (
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2, 
                color: '#666',
                textAlign: 'center',
                fontWeight: 500
              }}
            >
              Reset password for: <Box component="strong">{email}</Box>
            </Typography>
            
          

            <StyledTextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              margin="normal"
              value={formData.password}
              onChange={handleChange('password')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <StyledTextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm New Password"
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#666' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#d64b4b',
                color: 'white',
                height: '48px',
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '16px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#b73e3e'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#d64b4b',
                  opacity: 0.7,
                  color: 'white'
                }
              }}
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </Box>
        )}
      </StyledPaper>
    </Box>
  );
};

export default ResetPassword; 