import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Dialog as MuiDialog,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  Grid,
  Tooltip,
  styled,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  Modal,
  Checkbox,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import Layout from "../Layout/Layout";
import { COLORS } from "../../../constants";
import { authenticatedFetch } from '../../../utils/apiUtils';

const StyledPaper = {
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const ConfirmationModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  padding: "24px",
  backgroundColor: "white",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  borderRadius: "8px",
  textAlign: "center",
}));

const Header = styled(Box)(({ theme }) => ({
  backgroundColor: "#4a4a4a", // Dark grey background for header
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "18px",
}));

const ConfirmationText = styled(Typography)(({ theme }) => ({
  margin: "16px 0 24px",
  fontSize: "16px",
  color: "#333", // Dark grey text
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4a4a4a", // Dark grey
  color: "white",
  textTransform: "none",
  fontWeight: "bold",
  width: "100px",
  "&:hover": {
    backgroundColor: "#333", // Darker grey on hover
  },
}));

const CancelButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "#4a4a4a",
  textTransform: "none",
  fontWeight: "bold",
  border: "1px solid #4a4a4a",
  width: "100px",
  "&:hover": {
    backgroundColor: "#f5f5f5", // Light grey on hover
  },
}));

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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

export { ConfirmationModal };
const HeaderSection = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.base.darkgray,
  color: "white",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
}));

const StyledHeading = styled(Typography)(({ theme }) => ({
  fontSize: "24px",
  fontWeight: "bold",
}));

interface NewUserProps {
  isModalOpen: boolean;
  onClose: () => void;
  toggleSidebar: (open: boolean) => (event?: React.KeyboardEvent | React.MouseEvent) => void;
}

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

interface Role {
  id: string;
  name: string;
  description: string;
}

const StatusChip = ({ status }: { status: boolean | string | undefined }) => {
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
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
  padding: "12px 16px",
  marginBottom: "16px",
  borderRadius: "8px",
  color: "#333",
  fontSize: "15px",
});

const DetailValue = styled(Typography)({
  color: "#333",
  fontSize: "14px",
  marginBottom: "16px",
  fontWeight: "500",
});

const StyledDialogContent = styled(DialogContent)({
  backgroundColor: "#f9f9f9",
  padding: "24px",
});

const StyledDialogActions = styled(DialogActions)({
  backgroundColor: "#f9f9f9",
  borderTop: "1px solid #e0e0e0",
  padding: "16px 24px",
});

const StyledDialogTitle = styled(DialogTitle)({
  backgroundColor: "#4f4f4f",
  color: "white",
  fontSize: "20px",
  fontWeight: "500",
  padding: "16px 24px",
  borderBottom: "1px solid #e0e0e0",
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#eddddd",
  },
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
  cursor: "pointer",
  transition: "background-color 0.2s ease",
}));

const DetailLabel = styled(Typography)({
  color: "#666",
  fontSize: "14px",
  marginBottom: "4px",
  width: "150px",
});

const DetailValueBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "12px",
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: "8px 4px",
  backgroundColor: "#d64b4b",
  color: "white",
  textTransform: "none",
  padding: "6px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  "&:hover": {
    backgroundColor: "#b73e3e",
  },
}));

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

const BlockConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading: boolean;
}> = ({ isOpen, onClose, onConfirm, user, isLoading }) => {
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
          <ConfirmButton 
            onClick={onConfirm}
            disabled={isLoading}
            sx={{
              backgroundColor: isUserActive ? '#d32f2f' : '#2e7d32',
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
          </ConfirmButton>
          <CancelButton onClick={onClose} disabled={isLoading}>Cancel</CancelButton>
        </ButtonContainer>
      </ConfirmationModalContainer>
    </Modal>
  );
};

const UsersByRole: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<User | null>(null);
  const [isEditConfirmationOpen, setIsEditConfirmationOpen] = useState(false);
  const [isBlockConfirmationOpen, setIsBlockConfirmationOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchUsers = useCallback(async (role: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://185.84.140.118:8080'}/api/Roles/name/${role}/users`,
        {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${userToken}`
          }
        }
      );

      if (response.status === 403) {
        throw new Error('You do not have permission to access this resource');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch users');
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }
      
      // Process and filter users - only include users who have logged in
      const processedUsers = data
        .map((user: any) => ({
          id: user.id,
          username: user.userName || user.username || '',
          email: user.email || '',
          role: user.role || role,
          tenantId: user.tenantId || '',
          isActive: user.isActive === true || user.isActive === "True",
          createdDate: user.createdDate || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
          lastLoginDate: user.lastLoginDate
        }))
        .filter(user => user.lastLoginDate !== null); // Only include users who have logged in
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers(selectedRole);
  }, [fetchUsers, selectedRole]);

  // Update the useEffect for fetching roles to not depend on selectedRole
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/Roles`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${userToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }

        const data = await response.json();
        setRoles(data);
        
        // Set the first role as selected if no role is selected
        if (!selectedRole && data.length > 0) {
          setSelectedRole(data[0].name);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch roles');
      }
    };

    fetchRoles();
  }, []); // Remove selectedRole dependency

  // Handle role change
  const handleRoleChange = useCallback((newRole: string) => {
    setSelectedRole(newRole);
    setError(null); // Clear any previous errors
    fetchUsers(newRole);
  }, [fetchUsers]);

  // Filter users when search query changes
  useEffect(() => {
    if (!users.length) return;
    
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Update selected user when users change
  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find(u => u.id === selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  }, [users]);

  const handleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      setIsActionLoading(true);
      setError(null);
      
      const userToken = localStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/Auth/users/${selectedUser.id}/toggle-status`,
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
        throw new Error(errorText || 'Failed to update user status');
      }

      // Update local state
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, isActive: !user.isActive }
          : user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setSelectedUser(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
      setIsBlockDialogOpen(false);

    } catch (error) {
      console.error('Block/Unblock Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user status');
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleString() : "Never";

  const handleEditClick = () => {
    if (selectedUser) {
      setModalData(selectedUser);
      setIsModalOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    
      setIsEditConfirmationOpen(true);
    
  };

  const handleConfirmEditClose = () => {
    setIsEditConfirmationOpen(false);
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleCancelEditClose = () => {
    setIsEditConfirmationOpen(false);
  };

  const handleCloseBlockDialog = () => {
    setIsBlockDialogOpen(false);
    setTimeout(() => {
      setIsBlockConfirmationOpen(true);
    }, 100);
  };

  const handleConfirmBlockClose = () => {
    setIsBlockConfirmationOpen(false);
  };

  const handleCancelBlockClose = () => {
    setIsBlockConfirmationOpen(false);
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
            `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/api/Auth/users/${modalData.id}/role`,
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

          // Refresh the users list since role has changed
          await fetchUsers(selectedRole);
        }

        // Update local state for other changes
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

  const handleBlockClick = () => {
    if (selectedUser) {
      setIsModalOpen(false);
      setIsEditDialogOpen(false);
      setIsEditConfirmationOpen(false);
      setTimeout(() => {
        setIsBlockDialogOpen(true);
      }, 100);
    }
  };

  // Add cleanup effect after the existing useEffects
  useEffect(() => {
    return () => {
      // Cleanup function to reset all modal states when component unmounts
      setIsModalOpen(false);
      setIsEditDialogOpen(false);
      setIsBlockDialogOpen(false);
      setIsEditConfirmationOpen(false);
      setIsBlockConfirmationOpen(false);
      setModalData(null);
    };
  }, []);

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
              <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: "600", color: "#333" }}>
                  Users by Role
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Showing only users who have logged in at least once
                </Typography>
              </Box>

              <Tabs
                value={selectedRole}
                onChange={(e, newValue) => handleRoleChange(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
                textColor="primary"
                sx={{ px: 3, mb: 2 }}
              >
                {roles.map((role) => (
                  <Tab 
                    key={role.id} 
                    label={role.name} 
                    value={role.name}
                    sx={{
                      textTransform: 'none',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Tabs>

              <Box sx={{ 
                padding: { xs: "12px", sm: "16px", md: "20px" }, 
                borderBottom: "1px solid #eee" 
              }}>
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
                overflow: "auto",
                '& .MuiTable-root': {
                  minWidth: { xs: 500, sm: 650, md: 750 }
                }
              }}>
                {isLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                    <CircularProgress />
                  </Box>
                ) : filteredUsers.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          
                        </TableCell>
                        <TableCell sx={{ fontWeight: "600" }}>Username</TableCell>
                        <TableCell sx={{ fontWeight: "600" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "600" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "600" }}>Last Login</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <StyledTableRow
                          key={user.id}
                          hover
                          onClick={() => setSelectedUser(user)}
                          selected={selectedUser?.id === user.id}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox 
                              checked={selectedUser?.id === user.id}
                              sx={{ '&.Mui-checked': { color: '#d64b4b' } }}
                            />
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <StatusChip status={user.isActive} />
                          </TableCell>
                          <TableCell>
                            {formatDate(user.lastLoginDate)}
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",
                    minHeight: "300px",
                    color: "#666"
                  }}>
                    <SearchIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                    <Typography>
                      {error ? 'Error loading users' : 
                       'No logged-in users found for this role'}
                    </Typography>
                  </Box>
                )}
              </TableContainer>
            </Paper>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={4} sx={{ 
            height: { xs: "auto", md: "100%" },
            display: { xs: selectedUser ? "block" : "none", md: "block" }
          }}>
            <Paper sx={{ 
              height: "100%", 
              padding: { xs: "16px", sm: "20px", md: "24px" }, 
              display: "flex", 
              flexDirection: "column",
              borderRadius: { xs: "8px", sm: "12px" },
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              {selectedUser ? (
                <>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "24px" }}>
                    <Tooltip title="Edit User">
                      <StyledButton 
                        onClick={handleEditClick}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </StyledButton>
                    </Tooltip>
                    <Tooltip title={selectedUser.isActive === true || selectedUser.isActive === "True" ? "Block Account" : "Unblock Account"}>
                      <StyledButton
                        startIcon={<BlockIcon />}
                        onClick={handleBlockClick}
                        sx={{
                          backgroundColor: selectedUser.isActive === true || selectedUser.isActive === "True" ? '#d32f2f' : '#2e7d32',
                          '&:hover': {
                            backgroundColor: selectedUser.isActive === true || selectedUser.isActive === "True" ? '#b71c1c' : '#1b5e20',
                          }
                        }}
                      >
                        {selectedUser.isActive === true || selectedUser.isActive === "True" ? 'Block' : 'Unblock'}
                      </StyledButton>
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
                    <DetailValue>{formatDate(selectedUser.createdDate)}</DetailValue>
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

        {/* Edit Dialog */}
        <MuiDialog
          open={isModalOpen}
          onClose={handleCloseEditDialog}
          disablePortal
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
            <StyledCloseButton onClick={handleCloseEditDialog} aria-label="close">
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
                      prev ? { ...prev, role: e.target.value as string } : null
                    )
                  }
                  displayEmpty
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              onClick={handleCloseEditDialog}
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

        {/* Block Dialog */}
        <BlockConfirmationModal
          isOpen={isBlockDialogOpen}
          onClose={() => setIsBlockDialogOpen(false)}
          onConfirm={handleBlockUser}
          user={selectedUser}
          isLoading={isActionLoading}
        />

        {/* Confirmation Modals */}
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
      </Box>
      
    </Layout>
    
  );
};

export default UsersByRole;
