import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

const TaskTable = () => {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/task')
      .then(response => response.json())
      .then(data => {
        const formattedTasks = data.map(task => {
          // Format the due date as YYYY-MM-DD
          let formattedDueDate = '';
          if (task.dueDate) {
            const date = new Date(task.dueDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDueDate = `${year}-${month}-${day}`;
          }
          
          return {
            ...task,
            id: task._id,
            assignee: {
              name: task.assignedToUserId || 'Unassigned',
              initials: (task.assignedToUserId || 'U').charAt(0).toUpperCase()
            },
            progress: task.status === 'done' ? 100 : task.status === 'in-progress' ? 50 : 0,
            dueDate: formattedDueDate // Use the formatted date
          };
        });
        setRows(formattedTasks);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  // Updated priority color mapping
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  // Updated status color mapping
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'to-do': return 'primary'; // Blue for To Do
      case 'in-progress': return 'info'; // Light blue for In Progress
      case 'completed': return 'success'; // Green for Completed
      default: return 'default';
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'to-do': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleEdit = (id) => {
    const taskToEdit = rows.find(row => row.id === id);
    if (taskToEdit) {
      navigate('/edit', { state: { taskId: id } });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      fetch(`http://localhost:3000/task/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            setRows(prevRows => prevRows.filter(row => row.id !== id));
            console.log('Task deleted successfully:', id);
          } else {
            console.error('Failed to delete task:', id);
          }
        })
        .catch(error => console.error('Error deleting task:', error));
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Task Dashboard</Typography>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#d3d3d3' }}>
              <TableCell style={{ fontWeight: 'bold' }}>Project ID</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Assignee</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Due Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Priority</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Progress</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Typography>{row.projectId}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.title}</Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar style={{ color: '#A7C7E7', backgroundColor: '#F0FFFF' }}>{row.assignee.initials}</Avatar>
                    <Typography>{row.assignee.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {/* Only show the formatted due date */}
                  <Typography>{row.dueDate}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.priority} 
                    color={getPriorityColor(row.priority)} 
                    size="small" 
                    style={{ 
                      width: 75, 
                      borderRadius: 7,
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={formatStatus(row.status)} 
                    color={getStatusColor(row.status)} 
                    size="small" 
                    style={{ 
                      width: 100, 
                      borderRadius: 7,
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LinearProgress
                      variant="determinate"
                      value={row.progress}
                      sx={{ height: 8, borderRadius: 5, width: 50 }}
                      color="primary"
                    />
                    <Typography variant="caption" color="text.secondary">{row.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(row.id)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} display="flex" justifyContent="flex-start">
        <Typography variant="body2" color="text.secondary">
          Showing {rows.length} of {rows.length} tasks
        </Typography>
        <div style={{ right: 10, position: 'absolute', marginLeft: 'auto' }}>
          <Stack direction="row" spacing={2} ml={2}>
            <Button variant="contained" startIcon={<FileDownloadIcon />}>
              Export CSV
            </Button>
            <Button variant="contained" color="secondary" startIcon={<PrintIcon />}>
              Print
            </Button>
          </Stack>
        </div>
      </Box>
    </div>
  );
};

export default TaskTable;
