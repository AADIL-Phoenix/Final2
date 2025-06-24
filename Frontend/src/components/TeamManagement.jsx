import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import { 
  Box, Grid, Card, CardContent, Avatar, Typography, 
  Button, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Badge 
} from '@mui/material';
import { 
  Add, CheckCircle, 
  Person, Email, Close,
  Work, BusinessCenter
} from '@mui/icons-material';

const TeamManagement = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    userId: ''
  });
  
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/team');
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewMember({
      name: '',
      role: '',
      email: '',
      userId: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      const initials = newMember.name.split(' ').map(n => n[0]).join('');
      
      const member = {
        id: teamMembers.length + 1,
        initials,
        ...newMember
      };
      
      axios.post('http://localhost:3000/newuser', {
        username: newMember.name,
        email: newMember.email,
        role: newMember.role,
        userId: newMember.userId
      })
        .then((response) => {
          setTeamMembers([...teamMembers, response.data]);
          alert('Member added successfully!');
          handleCloseDialog();
        })
        .catch((error) => {
          console.error('Error adding team member:', error.response?.data || error.message);
          alert('Failed to add member. Please check the console for more details.');
        });
    }
  };

  return (
    <Box sx={{ 
      p: 4,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7f4 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto',
        background: 'white',
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Team Management
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              Manage your team members and assignments
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleOpenDialog}
            sx={{
              backgroundColor: 'white',
              color: '#4f46e5',
              '&:hover': { backgroundColor: '#f1f5f9' },
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)'
            }}
          >
            Add Member
          </Button>
        </Box>
        
        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3, fontWeight: 600 }}>
            Team Members
          </Typography>

          <Grid container spacing={3}>
            {teamMembers.map((member) => (
              <Grid item key={member.id} xs={12} sm={6} md={3}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: '16px', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  border: '1px solid #e2e8f0',
                  '&:hover': { 
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  }
                }}>
                  <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          member.completion === 100 ? (
                            <CheckCircle color="success" sx={{ 
                              fontSize: '1.2rem',
                              backgroundColor: 'white',
                              borderRadius: '50%'
                            }} />
                          ) : null
                        }
                      >
                        <Avatar sx={{ 
                          width: 72, 
                          height: 72, 
                          bgcolor: '#4f46e5',
                          fontSize: '1.75rem',
                          fontWeight: 600
                        }}>
                          {member.initials}
                        </Avatar>
                      </Badge>
                    </Box>
                    
                    <Typography variant="h6" align="center" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {member.name}
                    </Typography>
                    
                    <Typography variant="body2" align="center" sx={{ 
                      color: '#64748b', 
                      mb: 2,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5
                    }}>
                      <BusinessCenter fontSize="small" />
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Add Member Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: '500px',
            minHeight:'500px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            backgroundColor: '#f8fafc',
          } 
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: '1.25rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          py: 2,
          px: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1, color: '#4f46e5' }} />
            Add New Team Member
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={newMember.name}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: { 
                  fontWeight: 500, 
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="John Smith"
              sx={{ mt: 2 }}

            />
            
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={newMember.role}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: { 
                  fontWeight: 500, 
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="Frontend Developer"
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={newMember.email}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: { 
                  fontWeight: 500, 
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="john.smith@example.com"
            />
            
            <TextField
              fullWidth
              label="User ID"
              name="userId"
              value={newMember.userId}
              onChange={handleInputChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
                style: { 
                  fontWeight: 500, 
                  color: '#334155',
                  backgroundColor: 'white',
                  padding: '0 4px',
                  marginLeft: '-4px'
                }
              }}
              placeholder="12345"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: '1px solid #e2e8f0'
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              color: '#4a5568', 
              borderColor: '#cbd5e0',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                borderColor: '#a0aec0'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddMember}
            variant="contained"
            sx={{ 
              backgroundColor: '#4f46e5',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#4338ca'
              }
            }}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamManagement;
