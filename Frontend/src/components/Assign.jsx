import React, { useState } from 'react';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          }
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          }
        }
      }
    }
  },
});

const Assign = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [formData, setFormData] = useState({
    projectId: '',
    userId: '',
    tasks: [
      {
        id: 1,
        task: '',
        dueDate: '',
        submissionDate: '',
        priority: 'medium',
        description: ''
      }
    ]
  });
  const [errors, setErrors] = useState({});
  const [taskErrors, setTaskErrors] = useState([{}]);

  const steps = ['Project Details', 'Task Information', 'Review & Assign'];

  // Function to add a new task
  const addTask = () => {
    const newTaskId = formData.tasks.length > 0
      ? Math.max(...formData.tasks.map(t => t.id)) + 1
      : 1;

    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        {
          id: newTaskId,
          task: '',
          dueDate: '',
          submissionDate: '',
          priority: 'medium',
          description: ''
        }
      ]
    });

    setTaskErrors([...taskErrors, {}]);
  };

  // Function to remove a task
  const removeTask = (taskId) => {
    if (formData.tasks.length <= 1) return;

    setFormData({
      ...formData,
      tasks: formData.tasks.filter(task => task.id !== taskId)
    });

    // Also remove corresponding errors
    const taskIndex = formData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const newTaskErrors = [...taskErrors];
      newTaskErrors.splice(taskIndex, 1);
      setTaskErrors(newTaskErrors);
    }
  };

  // Handle change for project/user fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle change for task fields
  const handleTaskChange = (taskId, e) => {
    const { name, value } = e.target;

    const updatedTasks = formData.tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, [name]: value };
      }
      return task;
    });

    setFormData({
      ...formData,
      tasks: updatedTasks
    });

    // Clear error when field is changed
    const taskIndex = formData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1 && taskErrors[taskIndex]?.[name]) {
      const newTaskErrors = [...taskErrors];
      newTaskErrors[taskIndex] = {
        ...newTaskErrors[taskIndex],
        [name]: null
      };
      setTaskErrors(newTaskErrors);
    }
  };

  const handleNext = () => {
    let valid = true;
    const newErrors = {};
    const newTaskErrors = Array(formData.tasks.length).fill({}).map(() => ({}));

    if (activeStep === 0) {
      if (!formData.createdByUserId) {
        newErrors.createdByUserId = 'Created by User ID is required';
        valid = false;
      }
      // Validate project and user fields
      if (!formData.projectId) {
        newErrors.projectId = 'Project ID is required';
        valid = false;
      }
      if (!formData.userId) {
        newErrors.userId = 'User ID is required';
        valid = false;
      }
    } else if (activeStep === 1) {
      // Validate each task
      formData.tasks.forEach((task, index) => {
        if (!task.task) {
          newTaskErrors[index].task = 'Task description is required';
          valid = false;
        }
        if (!task.dueDate) {
          newTaskErrors[index].dueDate = 'Due date is required';
          valid = false;
        }
        if (!task.submissionDate) {
          newTaskErrors[index].submissionDate = 'Submission date is required';
          valid = false;
        }
      });
    }

    setErrors(newErrors);
    setTaskErrors(newTaskErrors);

    if (valid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting formData:", JSON.stringify(formData, null, 2));
      for (const task of formData.tasks) {
        const payload = {
          title: task.task || 'Default Title', // Ensure title is included
          description: task.description || '',
          status: 'to-do', // Default status
          priority: task.priority || 'medium',
          dueDate: task.dueDate || null,
          projectId: formData.projectId,
          assignedToUserId: formData.userId
        };
        await axios.post('http://localhost:3000/newtask', {
          ...payload,
          createdByUserId: formData.createdByUserId,
        });

      }
       setOpenSnackbar(true);

      // Reset form
      setFormData({
        projectId: '',
        userId: '',
        createdByUserId: '',
        tasks: [
          {
            id: 1,
            task: '',
            dueDate: '',
            submissionDate: '',
            priority: 'medium',
            description: ''
          }
        ]
      });
      setTaskErrors([{}]);
      setActiveStep(0);
    } catch (error) {
      console.error('Error submitting tasks:', error);
      alert('Failed to assign tasks. Please try again.');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="createdByUserId"
                label="Created By (User ID)"
                variant="outlined"
                value={formData.createdByUserId}
                onChange={handleChange}
                error={!!errors.createdByUserId}
                helperText={errors.createdByUserId}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="projectId"
                label="Project ID"
                variant="outlined"
                value={formData.projectId}
                onChange={handleChange}
                error={!!errors.projectId}
                helperText={errors.projectId}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="userId"
                label="User ID"
                variant="outlined"
                value={formData.userId}
                onChange={handleChange}
                error={!!errors.userId}
                helperText={errors.userId}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Assign multiple tasks to the user
            </Typography>

            {formData.tasks.map((task, index) => (
              <Box key={task.id} sx={{
                mb: 4,
                p: 3,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Task #{index + 1}</Typography>
                  {formData.tasks.length > 1 && (
                    <IconButton
                      onClick={() => removeTask(task.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="task"
                      label="Task Description"
                      variant="outlined"
                      value={task.task}
                      onChange={(e) => handleTaskChange(task.id, e)}
                      error={!!(taskErrors[index]?.task)}
                      helperText={taskErrors[index]?.task}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="dueDate"
                      label="Task Due Date"
                      type="date"
                      variant="outlined"
                      value={task.dueDate}
                      onChange={(e) => handleTaskChange(task.id, e)}
                      error={!!(taskErrors[index]?.dueDate)}
                      helperText={taskErrors[index]?.dueDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="submissionDate"
                      label="Task Submission Date"
                      type="date"
                      variant="outlined"
                      value={task.submissionDate}
                      onChange={(e) => handleTaskChange(task.id, e)}
                      error={!!(taskErrors[index]?.submissionDate)}
                      helperText={taskErrors[index]?.submissionDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!(taskErrors[index]?.priority)}>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        name="priority"
                        value={task.priority}
                        onChange={(e) => handleTaskChange(task.id, e)}
                        label="Priority"
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                      </Select>
                      {taskErrors[index]?.priority && (
                        <FormHelperText>{taskErrors[index].priority}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="description"
                      label="Additional Details"
                      variant="outlined"
                      value={task.description}
                      onChange={(e) => handleTaskChange(task.id, e)}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={addTask}
              sx={{ mt: 1 }}
            >
              Add Another Task
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Review Task Assignment
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="textSecondary">
                Project ID
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                {formData.projectId}
              </Typography>

              <Typography variant="subtitle1" color="textSecondary">
                User ID
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                {formData.userId}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Tasks to Assign ({formData.tasks.length})
              </Typography>

              <List>
                {formData.tasks.map((task, index) => (
                  <Box key={task.id} sx={{ mb: 3, p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Task #{index + 1}
                    </Typography>

                    <ListItem disablePadding>
                      <ListItemText
                        primary="Description"
                        secondary={task.task || 'None'}
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemText
                        primary="Due Date"
                        secondary={task.dueDate || 'Not specified'}
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemText
                        primary="Submission Date"
                        secondary={task.submissionDate || 'Not specified'}
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemText
                        primary="Priority"
                        secondary={task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Not specified'}
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemText
                        primary="Additional Details"
                        secondary={task.description || 'None'}
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f5f7fa"
        padding={2}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 800,
            backgroundColor: 'white',
          }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Task Assignment
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={3}>
              Assign multiple tasks to team members
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box component="form" noValidate autoComplete="off">
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Assign {formData.tasks.length} Task{formData.tasks.length > 1 ? 's' : ''}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 2 ? 'Review Tasks' : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Task(s) added successfully!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Assign;
