import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';



const TaskDashboard = () => {

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold">Task Dashboard</Typography>
            {/* <Typography variant="subtitle2" color="text.secondary">Demo Preview</Typography> */}
          </Box>
          <Button variant="contained" size="small" color="primary">
            Create New Task
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TaskDashboard;