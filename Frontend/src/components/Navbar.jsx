import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Button, Menu, MenuItem,
  Typography, IconButton, Avatar, Dialog
} from '@mui/material';
import AdminLogin from './AdminLogin';
import MemberSignup from './MemberSignup';





const Navbar = ({ isUserDashboard, loginOpen, setLoginOpen, signupOpen, setSignupOpen }) => {
  const navigate = useNavigate();
const memberNames = ['Neenu', 'Archa', 'Adil', 'Alisha'];
const adminNames = ['Alex Morgan', 'Admin2', 'Admin3'];
const [memberMenuAnchor, setMemberMenuAnchor] = useState(null);
const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const handleMemberClick = (event) => {
    setMemberMenuAnchor(event.currentTarget);
  };

const handleMemberSelect = (name) => {
    setMemberMenuAnchor(null);
    navigate(`/user/${encodeURIComponent(name)}`);
  };

  const handleAdminClick = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const handleAdminSelect = (name) => {
    setAdminMenuAnchor(null);
    setSelectedAdmin(name);
    setLoginOpen(true);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleClose();
  };

  const handleLogout = () => {
    setUser(null);
    handleClose();
  };

  // Custom SVG icon
  const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );

  return (
    <>
      <AppBar position="static" sx={{
        backgroundColor: 'white',
        color: '#333',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #eee'
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Brand Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3a8dff 0%, #6b5ce7 100%)',
              boxShadow: '0 4px 8px rgba(106, 92, 231, 0.3)'
            }}>
              <Box sx={{
                width: 30,
                height: 30,
                backgroundColor: 'white',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '50%',
                  backgroundColor: '#3a8dff'
                }}></Box>
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '50%',
                  height: '50%',
                  backgroundColor: '#6b5ce7'
                }}></Box>
              </Box>
            </Box>

            <Typography variant="h6" component="div" sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3a8dff 0%, #6b5ce7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              TaskFlow Pro
            </Typography>
          </Box>

          {/* Role Selection Buttons */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
                Hi, {user.name}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#6b5ce7',
                  fontSize: '1rem'
                }}>
                  {user.initials}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: 1 }}
              >
                <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            !isUserDashboard && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAdminClick}
                  sx={{
                    fontWeight: 600,
                    borderRadius: '8px',
                    px: 3,
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                      backgroundColor: 'rgba(106, 92, 231, 0.05)'
                    }
                  }}
                >
                  Admin
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleMemberClick}
                  sx={{
                    fontWeight: 600,
                    borderRadius: '8px',
                    px: 3,
                    backgroundColor: '#6b5ce7',
                    boxShadow: '0 4px 8px rgba(106, 92, 231, 0.3)',
                    '&:hover': {
                      backgroundColor: '#5a4bd0',
                      boxShadow: '0 6px 12px rgba(106, 92, 231, 0.4)'
                    }
                  }}
                >
                  Member
                </Button>
                <Menu
                  anchorEl={memberMenuAnchor}
                  open={Boolean(memberMenuAnchor)}
                  onClose={() => setMemberMenuAnchor(null)}
                >
                  {memberNames.map(name => (
                    <MenuItem key={name} onClick={() => handleMemberSelect(name)}>
                      {name}
                    </MenuItem>
                  ))}
                </Menu>
                <Menu
                  anchorEl={adminMenuAnchor}
                  open={Boolean(adminMenuAnchor)}
                  onClose={() => setAdminMenuAnchor(null)}
                >
                  {adminNames.map(name => (
                    <MenuItem key={name} onClick={() => handleAdminSelect(name)}>
                      {name}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )
          )}


          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { md: 'none' }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth="xs" fullWidth>
        <AdminLogin
          setUser={setUser}
          switchToSignup={() => {
            setLoginOpen(false);
            setSignupOpen(true);
          }}
          onClose={() => setLoginOpen(false)}
          selectedAdmin={selectedAdmin}
        />
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={signupOpen} onClose={() => setSignupOpen(false)} maxWidth="xs" fullWidth>
        <MemberSignup
          setUser={setUser}
          switchToLogin={() => {
            setSignupOpen(false);
            setLoginOpen(true);
          }}
          onClose={() => setSignupOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default Navbar;
