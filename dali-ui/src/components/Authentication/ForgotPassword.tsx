import React, { useState, useEffect } from 'react';
import {
  Box,
  Modal,
  FormControl,
  Typography,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { ARIA_LABELS, MESSAGES, VALIDATION } from '../../constants';
import { AccessibleTextField } from '../common/AccessibleTextField';
import { AccessibleButton } from '../common/AccessibleButton';
import { useA11y } from '../../hooks/useA11y';
import { styled } from '@mui/material/styles';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  maxWidth: 500,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  padding: 0,
  outline: 'none',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const ModalContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ModalActions = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
}));

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  open,
  handleClose,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { announceToScreenReader } = useA11y();

  useEffect(() => {
    if (open) {
      setEmail('');
      setError('');
      setIsSubmitting(false);
      setShowSuccessMessage(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      const clientUrl = process.env.REACT_APP_CLIENT_URL || 'http://localhost';
      const resetUrl = `${clientUrl}/reset-password?email=${encodeURIComponent(email)}&token=`;

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resetUrl,
          clientUrl,
          protocol: 'http'
        })
      });

      if (response.ok) {
        announceToScreenReader('A password reset link has been sent to your email address. Please check your inbox and follow the instructions.');
        setSuccessMessage(`Password reset instructions have been sent to ${email}. Please check your inbox and spam folder.`);
        setShowSuccessMessage(true);
        handleClose();
      } else {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(errorData.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to send reset email');
      announceToScreenReader(error.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = () => {
    if (!email) {
      setError(VALIDATION.EMAIL.REQUIRED);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(VALIDATION.EMAIL.INVALID);
      return false;
    }

    return true;
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="forgot-password-title"
        aria-describedby="forgot-password-description"
      >
        <ModalBox>
          <ModalHeader>
            <Typography
              id="forgot-password-title"
              variant="h6"
              component="h2"
            >
              Request New Password
            </Typography>
          </ModalHeader>

          <ModalContent>
            <Typography
              id="forgot-password-description"
              variant="body1"
              gutterBottom
            >
              Enter your account email address below. You will receive an email
              with a new password within a few minutes.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <FormControl fullWidth error={!!error}>
                <AccessibleTextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  error={!!error}
                  helperText={error}
                  icon={EmailIcon}
                  required
                  autoComplete="email"
                  aria-label={ARIA_LABELS.FORMS.EMAIL}
                  autoFocus
                  disabled={isSubmitting}
                />
              </FormControl>

              <ModalActions>
                <AccessibleButton
                  onClick={handleClose}
                  disabled={isSubmitting}
                  variant="outlined"
                  color="primary"
                >
                  Cancel
                </AccessibleButton>
                <AccessibleButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isSubmitting}
                >
                  Request Password
                </AccessibleButton>
              </ModalActions>
            </Box>
          </ModalContent>
        </ModalBox>
      </Modal>
      
      <Snackbar 
        open={showSuccessMessage} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ForgotPassword;