export const ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  READER: 'reader',
  PUBLISHER: 'publisher',
} as const;

// Update UserRole to match the Role type in AuthContext
export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: true,
  },
  [ROLES.OWNER]: {
    canEdit: true,
    canDelete: true,
    canPublish: true,
    canManageUsers: false,
  },
  [ROLES.PUBLISHER]: {
    canEdit: true,
    canDelete: false,
    canPublish: true,
    canManageUsers: false,
  },
  [ROLES.READER]: {
    canEdit: false,
    canDelete: false,
    canPublish: false,
    canManageUsers: false,
  }
};







// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   Button,
//   Box,
//   Divider,
// } from "@mui/material";
// import {
//   Menu as MenuIcon,
//   Person as PersonIcon,
//   Help as HelpIcon,
//   Home as HomeIcon,
//   Add as AddIcon,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import NewUser from "../NewUser"; // Ensure the path is correct
// import UserOverview from "./UserOverview"; // Import the UserOverview component
// import "../../../scss/NavBar.scss"; // Adjust the path

// const NavBar: React.FC = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isUserOverviewVisible, setIsUserOverviewVisible] = useState(false); // Toggle UserOverview visibility
//   const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleSidebar = (open: boolean) => (event?: React.KeyboardEvent | React.MouseEvent) => {
//     if (
//       event &&
//       event.type === "keydown" &&
//       ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
//     ) {
//       return;
//     }
//     setSidebarOpen(open);
//   };

//   const handleDrawerClose = () => {
//     setSidebarOpen(false);
//   };

//   const sidebarContent = (
//     <Box
//       sx={{
//         width: 300,
//         backgroundColor: "#f5f5f5",
//         height: "100%",
//       }}
//       role="presentation"
//     >
//       <Box
//         sx={{
//           padding: "16px",
//           backgroundColor: "#673ab7",
//           color: "white",
//           textAlign: "center",
//         }}
//       >
//         <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//           User Management
//         </Typography>
//       </Box>
//       <Divider />
//       <List>
//         {/* New User Button */}
//         <ListItem disablePadding>
//           <Button
//             fullWidth
//             startIcon={<AddIcon sx={{ color: "#673ab7" }} />}
//             sx={{
//               justifyContent: "flex-start",
//               textTransform: "none",
//               color: "#000",
//               fontSize: "16px",
//               padding: "12px 16px",
//               "&:hover": {
//                 backgroundColor: "#e0e7ff",
//               },
//               "&:active": {
//                 backgroundColor: "#c7d2fe",
//               },
//             }}
//             onClick={() => {
//               setIsNewUserModalOpen(true);
//               handleDrawerClose();
//             }}
//           >
//             New User
//           </Button>
//         </ListItem>

//         {/* User Overview Button */}
//         <ListItem disablePadding>
//           <Button
//             fullWidth
//             startIcon={<PersonIcon sx={{ color: "#673ab7" }} />}
//             sx={{
//               justifyContent: "flex-start",
//               textTransform: "none",
//               color: "#000",
//               fontSize: "16px",
//               padding: "12px 16px",
//               "&:hover": {
//                 backgroundColor: "#e0e7ff",
//               },
//               "&:active": {
//                 backgroundColor: "#c7d2fe",
//               },
//             }}
//             onClick={() => {
//               setIsUserOverviewVisible(true); // Show UserOverview
//               handleDrawerClose();
//             }}
//           >
//             User Overview
//           </Button>
//         </ListItem>
//         <ListItem disablePadding>
//           <Button
//             fullWidth
//             startIcon={<PersonIcon sx={{ color: "#673ab7" }} />}
//             sx={{
//               justifyContent: "flex-start",
//               textTransform: "none",
//               color: "#000",
//               fontSize: "16px",
//               padding: "12px 16px",
//               "&:hover": {
//                 backgroundColor: "#e0e7ff",
//               },
//               "&:active": {
//                 backgroundColor: "#c7d2fe",
//               },
//             }}
//             onClick={() => navigate("/last-logged-in")}
//           >
//             Last Logged In
//           </Button>
//         </ListItem>

//         {/* Users by Role Button */}
//         <ListItem disablePadding>
//           <Button
//             fullWidth
//             startIcon={<PersonIcon sx={{ color: "#673ab7" }} />}
//             sx={{
//               justifyContent: "flex-start",
//               textTransform: "none",
//               color: "#000",
//               fontSize: "16px",
//               padding: "12px 16px",
//               "&:hover": {
//                 backgroundColor: "#e0e7ff",
//               },
//               "&:active": {
//                 backgroundColor: "#c7d2fe",
//               },
//             }}
//             onClick={() => navigate("/users-by-role")}
//           >
//             Users by Role
//           </Button>
//         </ListItem>
//       </List>
//     </Box>
//   );

//   return (
//     <>
//       {/* NavBar */}
//       <AppBar position="static" className="navbar">
//         <Toolbar className="navbar__toolbar">
//           <Box className="navbar__left">
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               className="navbar__menu"
//               onClick={toggleSidebar(true)}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Box>
//           <Typography variant="h6" className="navbar__title">
//             USER MANAGEMENT
//           </Typography>
//           <Box className="navbar__right">
//             <IconButton color="inherit" className="navbar__icon">
//               <PersonIcon />
//             </IconButton>
//             <IconButton color="inherit" className="navbar__icon">
//               <HelpIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar Drawer */}
//       <Drawer
//         anchor="left"
//         open={sidebarOpen}
//         onClose={(event, reason) => {
//           if (reason === "backdropClick" || reason === "escapeKeyDown") {
//             setSidebarOpen(false);
//           }
//         }}
//         PaperProps={{
//           sx: {
//             boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
//           },
//         }}
//       >
//         {sidebarContent}
//       </Drawer>

//       {/* Render UserOverview */}
//       {isUserOverviewVisible && (
//         <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
//           <Drawer
//             variant="persistent"
//             anchor="left"
//             open={sidebarOpen}
//             sx={{ width: 300 }}
//             PaperProps={{
//               sx: {
//                 width: 300,
//                 backgroundColor: "#f5f5f5",
//                 boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
//               },
//             }}
//           >
//             {sidebarContent}
//           </Drawer>
//           <Box sx={{ flex: 1, overflow: "auto" }}>
//             <UserOverview />
//           </Box>
//         </Box>
//       )}

//       {/* New User Modal */}
//       {isNewUserModalOpen && (
//         <NewUser
//           isModalOpen={isNewUserModalOpen}
//           onClose={() => setIsNewUserModalOpen(false)}
//           toggleSidebar={toggleSidebar}
//         />
//       )}
//     </>
//   );
// };

// export default NavBar;
