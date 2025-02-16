import React, { useState, useEffect, useCallback } from "react";
import styled from '@emotion/styled';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Checkbox,
  Grid,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  Dialog as MuiDialog,
  DialogContentText,
  Modal,
  FormControlLabel,
} from "@mui/material";
import { 
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Layout from '../Layout/Layout';
import { authenticatedFetch } from '../../../utils/apiUtils';


const StyledPaper = {
  padding: { xs: "16px", sm: "20px", md: "24px" },
  borderRadius: { xs: "8px", sm: "12px" },
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};
const StyledButton = styled(Button)({
  margin: '4px 2px',
  padding: '6px 16px',
  fontSize: '14px',
  backgroundColor: "#d64b4b",
  color: "white",
  textTransform: "none",
  borderRadius: "8px",
  fontWeight: "500",
  "&:hover": {
    backgroundColor: "#b73e3e",
  },
  '@media (min-width: 600px)': {
    margin: '8px 4px',
    padding: '8px 20px',
    fontSize: '15px',
  }
});

const StyledTableRow = styled(TableRow)({
  "&:nth-of-type(odd)": {
    backgroundColor: "#eddddd",
  },
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
  cursor: "pointer",
  transition: "background-color 0.2s ease",
});

const StyledTableCell = styled(TableCell)({
  padding: '8px 12px',
  fontSize: '13px',
  borderBottom: "1px solid #e0e0e0",
  '@media (min-width: 600px)': {
    padding: '12px 16px',
    fontSize: '14px',
  }
});

const StatusChip = ({ status }: { status: boolean | string }) => {
  const isUserActive = status === true || status === "True";

  return (
    <Chip
      label={isUserActive ? "Active" : "Inactive"}
      icon={isUserActive ? <CheckCircleIcon /> : <CancelIcon />}
      size="small"
      sx={{
        backgroundColor: isUserActive ? "#e6f4ea" : "#fde7e7",
        color: isUserActive ? "#1e4620" : "#c62828",
        "& .MuiChip-icon": { color: "inherit" },
        fontWeight: "500",
      }}
    />
  );
};


const SectionTitle = styled(Typography)({
  padding: '8px 12px',
  fontSize: '14px',
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
  marginBottom: "16px",
  borderRadius: "8px",
  color: "#333",
  '@media (min-width: 600px)': {
    padding: '12px 16px',
    fontSize: '15px',
  }
});

const DetailLabel = styled(Typography)({
  fontSize: '13px',
  width: '120px',
  color: "#666",
  marginBottom: "4px",
  '@media (min-width: 600px)': {
    fontSize: '14px',
    width: '150px',
  }
});

const DetailValue = styled(Typography)({
  fontSize: '13px',
  color: "#333",
  marginBottom: "16px",
  fontWeight: "500",
  '@media (min-width: 600px)': {
    fontSize: '14px',
  }
});

const DetailValueBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: '12px',
  marginBottom: "12px",
  '@media (min-width: 600px)': {
    gap: '16px',
  }
});

const StyledDialogTitle = styled(DialogTitle)({
  padding: '12px 20px',
  fontSize: '18px',
  backgroundColor: "#4f4f4f",
  color: "white",
  fontWeight: "500",
  borderBottom: "1px solid #e0e0e0",
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  '@media (min-width: 600px)': {
    padding: '16px 24px',
    fontSize: '20px',
  }
});

const StyledDialogContent = styled(DialogContent)({
  padding: '16px',
  backgroundColor: "#f9f9f9",
  '@media (min-width: 600px)': {
    padding: '24px',
  }
});

const StyledDialogActions = styled(DialogActions)({
  padding: '12px 20px',
  backgroundColor: "#f9f9f9",
  borderTop: "1px solid #e0e0e0",
  '@media (min-width: 600px)': {
    padding: '16px 24px',
  }
});

const ConfirmationModalContainer = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '90%',
  maxWidth: "400px",
  padding: '16px',
  backgroundColor: "white",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  textAlign: "center",
  '@media (min-width: 600px)': {
    width: '400px',
    padding: '24px',
  }
});

const Header = styled(Box)({
  padding: '8px',
  fontSize: '16px',
  backgroundColor: "#4a4a4a",
  color: "white",
  borderRadius: "8px",
  fontWeight: "bold",
  '@media (min-width: 600px)': {
    padding: '12px',
    fontSize: '18px',
  }
});

const ConfirmationText = styled(Typography)({
  margin: '12px 0 20px',
  fontSize: '14px',
  color: "#333",
  '@media (min-width: 600px)': {
    margin: '16px 0 24px',
    fontSize: '16px',
  }
});

const ButtonContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  gap: '12px',
  '@media (min-width: 600px)': {
    gap: '16px',
  }
});

const ConfirmButton = styled(Button)({
  width: '80px',
  backgroundColor: "#4a4a4a",
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#333",
  },
  '@media (min-width: 600px)': {
    width: '100px',
  }
});

const CancelButton = styled(Button)({
  width: '80px',
  backgroundColor: "white",
  color: "#4a4a4a",
  textTransform: "none",
  fontWeight: "bold",
  border: "1px solid #4a4a4a",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  '@media (min-width: 600px)': {
    width: '100px',
  }
});

const StyledCloseButton = styled(IconButton)({
  color: "white",
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)"
  }
});

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  tenantId: string;
  isActive: boolean | string;
  createdDate: string;
  updatedAt: string;
  lastLoginDate: string | null;
}

interface BlockFormData {
  reason: string;
  blockPeriod: 'temporary' | 'permanent';
  endDate?: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface TenantFormData {
  name: string;
  description: string;
}

interface RoleFormData {
  name: string;
  description: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ConfirmationModalContainer>
        <Header>Close notification</Header>
        <ConfirmationText>Are you sure you want to close the screen?</ConfirmationText>
        <ButtonContainer>
          <ConfirmButton onClick={onConfirm}>Yes</ConfirmButton>
          <CancelButton onClick={onClose}>No</CancelButton>
        </ButtonContainer>
      </ConfirmationModalContainer>
    </Modal>
  );
};

const BlockConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isBlocking: boolean;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, user, isBlocking, isLoading }) => {
  if (!user) return null;

  const isUserActive = user.isActive === true || user.isActive === "True";

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ConfirmationModalContainer>
        <Header>{isUserActive ? 'Block User' : 'Unblock User'}</Header>
        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Current Status:</Typography>
          <StatusChip status={user.isActive} />
        </Box>
        <ConfirmationText>
          Are you sure you want to {isUserActive ? 'block' : 'unblock'} user "{user.username}"?
        </ConfirmationText>
        <ButtonContainer>
          <Button 
            onClick={onConfirm}
            disabled={isLoading}
            variant="contained"
            sx={{
              backgroundColor: isUserActive ? '#d32f2f' : '#2e7d32',
              color: 'white',
              textTransform: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontWeight: '500',
              width: 'auto',
              minWidth: '120px',
              '&:hover': {
                backgroundColor: isUserActive ? '#b71c1c' : '#1b5e20',
              },
              '&.Mui-disabled': {
                backgroundColor: isUserActive ? '#d32f2f' : '#2e7d32',
                opacity: 0.7,
              }
            }}
          >
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              `Yes, ${isUserActive ? 'Block' : 'Unblock'}`
            )}
          </Button>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outlined"
            sx={{
              color: '#4a4a4a',
              borderColor: '#4a4a4a',
              textTransform: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#4a4a4a',
              }
            }}
          >
            Cancel
          </Button>
        </ButtonContainer>
      </ConfirmationModalContainer>
    </Modal>
  );
};

const UserOverview: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [blockFormData, setBlockFormData] = useState<BlockFormData>({
    reason: '',
    blockPeriod: 'permanent'
  });
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
  const [isBlockConfirmationOpen, setIsBlockConfirmationOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>({});
  const [blockConfirmation, setBlockConfirmation] = useState<{
    isOpen: boolean;
    user: User | null;
    isBlocking: boolean;
  }>({
    isOpen: false,
    user: null,
    isBlocking: true
  });
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false);
  const [tenantFormData, setTenantFormData] = useState<TenantFormData>({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [roleFormData, setRoleFormData] = useState<RoleFormData>({
    name: '',
    description: ''
  });
  const [isRoleSubmitting, setIsRoleSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Auth/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('Users data from backend:', data);
      
      const processedUsers = data.map((user: User) => ({
        ...user,
        isActive: user.isActive
      }));
      
      setUsers(processedUsers);
      setSelectedRows({});
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRowClick = (user: User) => {
    setSelectedRows({ [user.id]: true });
    setSelectedUser(user);
  };

  const handleCheckboxClick = (e: React.MouseEvent<HTMLButtonElement>, user: User) => {
    e.stopPropagation();
    setSelectedRows({ [user.id]: true });
    setSelectedUser(user);
  };

  const handleOpenModal = () => {
    setModalData(selectedUser);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    // Show confirmation dialog when clicking X or Cancel
    setIsEditConfirmationOpen(true);
  };

  const handleModalSave = async () => {
    if (modalData) {
      try {
        setIsLoading(true);
        setError(null);

        // If role has changed, update it via API
        if (modalData.role !== selectedUser?.role) {
          // Close dialog immediately
          setIsModalOpen(false);
          setModalData(null);
          setIsEditConfirmationOpen(false);

          const response = await authenticatedFetch(
            `${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Auth/users/${modalData.id}/role`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                newRole: modalData.role
              })
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to update user role');
          }

          setSuccessMessage('Role updated successfully');

          // Refresh users list
          await fetchUsers();
        }

        // Update local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === modalData.id ? { ...user, ...modalData } : user
          )
        );
        setSelectedUser(modalData);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error updating user:', error);
        setError(error instanceof Error ? error.message : 'Failed to update user');
        setSuccessMessage(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmEditClose = () => {
    setIsEditConfirmationOpen(false);
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleCancelEditClose = () => {
    setIsEditConfirmationOpen(false);
  };

  const handleBlockButtonClick = (user: User) => {
    const isUserActive = user.isActive === true || user.isActive === "True";

    setBlockConfirmation({
      isOpen: true,
      user,
      isBlocking: isUserActive
    });
  };

  const handleBlockConfirmationClose = () => {
    setBlockConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleBlockUser = async () => {
    const userToBlock = blockConfirmation.user;
    if (!userToBlock) return;

    try {
      setIsActionLoading(true);
      setError(null);
      
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Auth/users/${userToBlock.id}/toggle-status`,
        {
          method: 'POST',
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${userToken}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(errorText || 'Failed to update user status');
      }

      // Get the current status
      const currentStatus = userToBlock.isActive === true || userToBlock.isActive === "True";
      
      // Update only the specific user's status in the users list
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userToBlock.id 
            ? { ...user, isActive: !currentStatus }
            : user
        )
      );

      // Update the selected user's status
      setSelectedUser(prev => {
        if (prev && prev.id === userToBlock.id) {
          return { ...prev, isActive: !currentStatus };
        }
        return prev;
      });

      // Keep the selection state
      setSelectedRows(prev => ({
        ...prev,
        [userToBlock.id]: true
      }));

      handleBlockConfirmationClose();
      setIsBlockDialogOpen(false);

    } catch (error) {
      console.error('Block/Unblock Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user status. Please try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBlockDialogClose = () => {
    setIsBlockDialogOpen(false);
  };

  // Filter records based on search query
  const filteredData = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleCloseBlockDialog = () => {
    setIsBlockConfirmationOpen(true);
  };

  const handleConfirmBlockClose = () => {
    setIsBlockConfirmationOpen(false);
    setIsBlockDialogOpen(false);
  };

  const handleCancelBlockClose = () => {
    setIsBlockConfirmationOpen(false);
  };

  const handleTenantDialogOpen = () => {
    setIsTenantDialogOpen(true);
  };

  const handleTenantDialogClose = () => {
    setIsTenantDialogOpen(false);
    setTenantFormData({
      name: '',
      description: ''
    });
  };

  const handleTenantFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTenantFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTenantSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate required fields
      if (!tenantFormData.name) {
        throw new Error('Please fill in all required fields');
      }

      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Tenant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        },
        body: JSON.stringify({
          Name: tenantFormData.name,
          description: tenantFormData.description || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to create tenant');
      }

      setSuccessMessage('Tenant created successfully');
      handleTenantDialogClose();
      
      // Optionally refresh the data after creating a new tenant
      await fetchUsers();
    } catch (error) {
      console.error('Error creating tenant:', error);
      setError(error instanceof Error ? error.message : 'Failed to create tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleDialogOpen = () => {
    setIsRoleDialogOpen(true);
  };

  const handleRoleDialogClose = () => {
    setIsRoleDialogOpen(false);
    setRoleFormData({
      name: '',
      description: ''
    });
  };

  const handleRoleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoleFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSubmit = async () => {
    try {
      setIsRoleSubmitting(true);
      setError(null);

      if (!roleFormData.name) {
        throw new Error('Please fill in all required fields');
      }

      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        },
        body: JSON.stringify({
          name: roleFormData.name,
          description: roleFormData.description || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to create role');
      }

      setSuccessMessage('Role created successfully');
      handleRoleDialogClose();
      
      // Optionally refresh the data
      await fetchUsers();
    } catch (error) {
      console.error('Error creating role:', error);
      setError(error instanceof Error ? error.message : 'Failed to create role');
    } finally {
      setIsRoleSubmitting(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ 
        padding: { xs: "12px", sm: "16px", md: "24px" }, 
        height: "100vh", 
        overflow: "hidden", 
        backgroundColor: "#f5f7fa" 
      }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ marginBottom: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert 
            severity="success" 
            sx={{ marginBottom: 2 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}
        
        <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ height: "100%" }}>
          {/* Left Section - Table */}
          <Grid item xs={12} md={8} sx={{ 
            height: { xs: "auto", md: "100%" },
            overflow: "auto",
            marginBottom: { xs: 2, md: 0 }
          }}>
            <Paper sx={{ 
              height: "100%", 
              display: "flex", 
              flexDirection: "column", 
              borderRadius: { xs: "8px", sm: "12px" }, 
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
            }}>
              {/* Buttons and Search Box */}
              <Box sx={{ 
                padding: { xs: "12px", sm: "16px", md: "20px" }, 
                borderBottom: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}>
                {/* Buttons Container */}
                <Box sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap"
                }}>
                  <Button
                    variant="contained"
                    onClick={handleTenantDialogOpen}
                    sx={{
                      backgroundColor: "#d64b4b",
                      color: "white",
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: "500",
                      padding: "8px 16px",
                      fontSize: { xs: "13px", sm: "14px" },
                      "&:hover": {
                        backgroundColor: "#b73e3e",
                      }
                    }}
                  >
                    Create Tenant
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleRoleDialogOpen}
                    sx={{
                      backgroundColor: "#d64b4b",
                      color: "white",
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: "500",
                      padding: "8px 16px",
                      fontSize: { xs: "13px", sm: "14px" },
                      "&:hover": {
                        backgroundColor: "#b73e3e",
                      }
                    }}
                  >
                    Create Role
                  </Button>
                </Box>

                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search by username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#888" }} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '6px', sm: '8px' },
                      fontSize: { xs: '13px', sm: '14px' }
                    }
                  }}
                />
              </Box>

              {/* Table Container */}
              <TableContainer sx={{ 
                flexGrow: 1,
                '& .MuiTable-root': {
                  minWidth: { xs: 500, sm: 650, md: 750 }
                }
              }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell padding="checkbox" sx={{ backgroundColor: '#f8f9fa' }}></StyledTableCell>
                        <StyledTableCell sx={{ backgroundColor: '#f8f9fa', fontWeight: '600' }}>Username</StyledTableCell>
                        <StyledTableCell sx={{ backgroundColor: '#f8f9fa', fontWeight: '600' }}>Email</StyledTableCell>
                        <StyledTableCell sx={{ backgroundColor: '#f8f9fa', fontWeight: '600' }}>Role</StyledTableCell>
                        <StyledTableCell sx={{ backgroundColor: '#f8f9fa', fontWeight: '600' }}>Status</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((user) => (
                        <StyledTableRow
                          key={user.id}
                          hover
                          onClick={() => handleRowClick(user)}
                          selected={selectedUser?.id === user.id}
                        >
                          <StyledTableCell padding="checkbox">
                            <Checkbox 
                              checked={selectedUser?.id === user.id}
                              onClick={(e) => handleCheckboxClick(e, user)}
                              sx={{ '&.Mui-checked': { color: '#d64b4b' } }}
                            />
                          </StyledTableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{
                              backgroundColor: '#f0f0f0',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              display: 'inline-block',
                              fontSize: '13px'
                            }}>
                              {user.role}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <StatusChip status={user.isActive} />
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </Paper>
          </Grid>

          {/* Right Section - Details */}
          <Grid item xs={12} md={4} sx={{ 
            height: { xs: "auto", md: "100%" },
            display: "block"
          }}>
            <Paper sx={{ 
              height: "100%", 
              padding: { xs: "16px", sm: "20px", md: "24px" }, 
              display: "flex", 
              flexDirection: "column",
              borderRadius: { xs: "8px", sm: "12px" },
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              {selectedUser && selectedRows[selectedUser.id] ? (
                <>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "24px" }}>
                    <Tooltip title="Edit User">
                      <StyledButton 
                        onClick={handleOpenModal}
                        startIcon={<EditIcon />}
                        sx={{
                          backgroundColor: '#d64b4b',
                          '&:hover': {
                            backgroundColor: '#b73e3e',
                          }
                        }}
                      >
                        Edit
                      </StyledButton>
                    </Tooltip>
                    <Tooltip title={(selectedUser.isActive === true || selectedUser.isActive === "True") ? "Block Account" : "Unblock Account"}>
                      <Button
                        startIcon={<BlockIcon />}
                        onClick={() => handleBlockButtonClick(selectedUser)}
                        variant="contained"
                        sx={{
                          backgroundColor: (selectedUser.isActive === true || selectedUser.isActive === "True") ? '#d64b4b' : '#2e7d32',
                          color: 'white',
                          textTransform: 'none',
                          padding: '6px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          margin: '8px 4px',
                          '&:hover': {
                            backgroundColor: (selectedUser.isActive === true || selectedUser.isActive === "True") ? '#b73e3e' : '#1b5e20',
                          }
                        }}
                      >
                        {(selectedUser.isActive === true || selectedUser.isActive === "True") ? 'Block' : 'Unblock'}
                      </Button>
                    </Tooltip>
                  </Box>

                  <Box sx={{overflow: "auto" }}>
                    <SectionTitle>User Data</SectionTitle>
                    <DetailLabel>Username</DetailLabel>
                    <DetailValue>{selectedUser.username}</DetailValue>
                    <DetailLabel>Email</DetailLabel>
                    <DetailValue>{selectedUser.email}</DetailValue>
                    
                    <SectionTitle>Account Details</SectionTitle>
                    
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>
                      <StatusChip status={selectedUser.isActive} />
                    </DetailValue>
                    <DetailLabel>Registration Date</DetailLabel>
                    <DetailValue>{selectedUser.createdDate ? formatDate(selectedUser.createdDate) : 'Not available'}</DetailValue>
                    <DetailLabel>Last Login</DetailLabel>
                    <DetailValue>{selectedUser.lastLoginDate ? formatDate(selectedUser.lastLoginDate) : 'Never'}</DetailValue>

                    <SectionTitle>User Rights</SectionTitle>
                    <DetailLabel>Role</DetailLabel>
                    <DetailValue>{selectedUser.role}</DetailValue>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "#666",
                    gap: "12px",
                  }}
                >
                  <SearchIcon sx={{ fontSize: 48, color: '#ccc' }} />
                  <Typography variant="subtitle1">
                    Select a user to view details
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Edit User Modal */}
        <MuiDialog
          open={isModalOpen}
          onClose={handleCloseEditModal}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              maxWidth: "100%",
              width: "95%",
              maxHeight: "100vh",
              height: "90vh",
            },
          }}
        >
          <StyledDialogTitle>
            Edit User
            <StyledCloseButton onClick={handleCloseEditModal} aria-label="close">
              <CloseIcon />
            </StyledCloseButton>
          </StyledDialogTitle>
          <StyledDialogContent>
            {/* Username Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Typography sx={{ minWidth: "120px", fontWeight: "500" }}>Username</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={modalData?.username || ""}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed"
                  }
                }}
              />
            </Box>

            {/* Email Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Typography sx={{ minWidth: "120px", fontWeight: "500" }}>Email</Typography>
              <TextField
                fullWidth
                margin="normal"
                value={modalData?.email || ""}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    backgroundColor: "#f5f5f5",
                    cursor: "not-allowed"
                  }
                }}
              />
            </Box>

            {/* Role Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Typography sx={{ minWidth: "120px", fontWeight: "500" }}>Role</Typography>
              <FormControl fullWidth margin="normal">
                <Select
                  value={modalData?.role || ""}
                  onChange={(e) =>
                    setModalData((prev) =>
                      prev ? { ...prev, role: e.target.value } : null
                    )
                  }
                  displayEmpty
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Owner">Owner</MenuItem>
                  <MenuItem value="Publisher">Publisher</MenuItem>
                  <MenuItem value="Reader">Reader</MenuItem>
                  <MenuItem value="User">User</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              onClick={handleCloseEditModal}
              sx={{
                textTransform: "none",
                fontWeight: "500",
                color: "#666",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleModalSave}
              
              variant="contained"
              sx={{
                backgroundColor: "#d64b4b",
                
                textTransform: "none",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "#b73e3e",
                },
                
                
              }}
            >
              Save Changes
            </Button>
          </StyledDialogActions>
        </MuiDialog>

        {/* Block Confirmation Modal */}
        <BlockConfirmationModal
          isOpen={blockConfirmation.isOpen}
          onClose={handleBlockConfirmationClose}
          onConfirm={handleBlockUser}
          user={blockConfirmation.user}
          isBlocking={blockConfirmation.isBlocking}
          isLoading={isActionLoading}
        />

        {/* Add Confirmation Modals */}
        <ConfirmationModal
          isOpen={isEditConfirmationOpen}
          onClose={handleCancelEditClose}
          onConfirm={handleConfirmEditClose}
        />

        <ConfirmationModal
          isOpen={isBlockConfirmationOpen}
          onClose={handleCancelBlockClose}
          onConfirm={handleConfirmBlockClose}
        />

        {/* Tenant Creation Dialog */}
        <Dialog
          open={isTenantDialogOpen}
          onClose={handleTenantDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
            },
          }}
        >
          <DialogTitle sx={{
            backgroundColor: "#4f4f4f",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
          }}>
            Create New Tenant
            <IconButton
              onClick={handleTenantDialogClose}
              sx={{ color: "white" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: "24px" }}>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Tenant Name"
                name="name"
                value={tenantFormData.name}
                onChange={handleTenantFormChange}
                required
                sx={{ marginTop: 1 }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={tenantFormData.description}
                onChange={handleTenantFormChange}
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px", borderTop: "1px solid #e0e0e0" }}>
            <Button
              onClick={handleTenantDialogClose}
              sx={{
                color: "#666",
                textTransform: "none",
                fontWeight: "500",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTenantSubmit}
              disabled={isSubmitting || !tenantFormData.name}
              variant="contained"
              sx={{
                backgroundColor: "#d64b4b",
                color: "white",
                textTransform: "none",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "#b73e3e",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#d64b4b",
                  opacity: 0.7,
                }
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Tenant"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Role Creation Dialog */}
        <Dialog
          open={isRoleDialogOpen}
          onClose={handleRoleDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
            },
          }}
        >
          <DialogTitle sx={{
            backgroundColor: "#4f4f4f",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
          }}>
            Create New Role
            <IconButton
              onClick={handleRoleDialogClose}
              sx={{ color: "white" }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: "24px" }}>
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Role Name"
                name="name"
                value={roleFormData.name}
                onChange={handleRoleFormChange}
                required
                sx={{ marginTop: 1 }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={roleFormData.description}
                onChange={handleRoleFormChange}
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px", borderTop: "1px solid #e0e0e0" }}>
            <Button
              onClick={handleRoleDialogClose}
              sx={{
                color: "#666",
                textTransform: "none",
                fontWeight: "500",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRoleSubmit}
              disabled={isRoleSubmitting || !roleFormData.name}
              variant="contained"
              sx={{
                backgroundColor: "#d64b4b",
                color: "white",
                textTransform: "none",
                fontWeight: "500",
                "&:hover": {
                  backgroundColor: "#b73e3e",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#d64b4b",
                  opacity: 0.7,
                }
              }}
            >
              {isRoleSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Role"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default UserOverview;