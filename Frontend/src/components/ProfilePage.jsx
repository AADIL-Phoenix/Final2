import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Card, CardContent, Typography, Avatar, 
  Button, TextField, Divider, List, ListItem, 
  ListItemAvatar, ListItemText, Badge
} from '@mui/material';
import TaskTable from './Admin/TaskTable';
import { Edit, Email, Work } from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get user from location state or localStorage
  const [userData, setUserData] = useState(() => {
    if (location.state?.user) {
      return location.state.user;
    }
    
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {
      name: 'Alex Morgan',
      role: 'Admin',
      email: 'alex.morgan@taskflowpro.com',
      avatar: 'A',
      userId: 'admin1'
    };
  });

  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email
  });

  useEffect(() => {
    // Update form data when user data changes
    setFormData({
      name: userData.name,
      email: userData.email
    });
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Update user data
    const updatedUser = {
      ...userData,
      name: formData.name,
      email: formData.email
    };
    
    setUserData(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    console.log('Profile updated:', formData);
  };

  return (
    <Box className="profile-page" sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
          {userData.role} Profile
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Edit />}
          onClick={() => setIsEditing(!isEditing)}
          sx={{
            background: 'linear-gradient(45deg, #3a8dff 0%, #6b5ce7 100%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2a7def 0%, #5b4cd7 100%)',
            }
          }}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </Button>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 3 }}>
        <CardContent sx={{ textAlign: 'center', pt: 4 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Avatar sx={{ 
                bgcolor: '#6b5ce7', 
                width: 32, 
                height: 32,
                border: '2px solid white'
              }}>
                <Work fontSize="small" />
              </Avatar>
            }
          >
            <Avatar sx={{ 
              width: 120, 
              height: 120, 
              fontSize: 48, 
              bgcolor: '#3a8dff',
              mb: 2,
              mx: 'auto'
            }}>
              {userData.avatar}
            </Avatar>
          </Badge>
          
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {isEditing ? (
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="standard"
                sx={{ mb: 2 }}
              />
            ) : userData.name}
          </Typography>
          <List>
            <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#e3f2fd' }}>
                  <Email sx={{ color: '#3a8dff' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary="Email" 
                secondary={isEditing ? (
                  <TextField
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="standard"
                  />
                ) : userData.email}
                sx={{ 
                  '& .MuiListItemText-primary': { textAlign: 'center' },
                  '& .MuiListItemText-secondary': { textAlign: 'center' }
                }}
              />
            </ListItem>
          </List>
          <Typography variant="body2" sx={{ 
            color: '#6b5ce7', 
            fontWeight: 600, 
            mb: 3,
            bgcolor: '#f0f4ff',
            py: 0.5,
            px: 2,
            borderRadius: 2,
            display: 'inline-block'
          }}>
            {userData.role}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 2, 
            mt: 2, 
            mb: 3 
          }}>
            <Button 
              variant="outlined" 
              fullWidth
              onClick={() => navigate('/assign')}
              sx={{
                fontWeight: 600,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px',
                }
              }}
            >
              Assign Task
            </Button>
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => navigate('/team-management')}
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #6b5ce7 0%, #3a8dff 100%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5b4cd7 0%, #2a7def 100%)',
                }
              }}
            >
              Team Management
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {isEditing && (
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleSave}
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Task Table Section */}
      <Box sx={{ mt: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <TaskTable />
      </Box>
    </Box>
  );
};

export default ProfilePage;