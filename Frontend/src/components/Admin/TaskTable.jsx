import React from 'react'
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
import AssignmentTurnedInIcon from '@mui/icons-material/Assignment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
const rows = [
  {
    id: 'TSK-001',
    task: 'Complete project proposal',
    assignee: { name: 'Archa', initials: 'AR' },
    dueDate: '2023-06-15',
    statusText: 'On track',
    priority: 'High',
    status: 'In Progress',
    progress: 65
  },
  {
    id: 'TSK-002',
    task: 'Review marketing materials',
    assignee: { name: 'Aadil', initials: 'AA' },
    dueDate: '2023-06-10',
    statusText: 'Overdue',
    priority: 'Medium',
    status: 'Pending',
    progress: 20
  },
  {
    id: 'TSK-003',
    task: 'Client meeting preparation',
    assignee: { name: 'Alisha', initials: 'AL' },
    dueDate: '2023-06-12',
    statusText: 'On track',
    priority: 'Low',
    status: 'Completed',
    progress: 100
  },
  {
    id: 'TSK-004',
    task: 'API documentation',
    assignee: { name: 'Neenu', initials: 'NE' },
    dueDate: '2023-06-18',
    statusText: 'On track',
    priority: 'High',
    status: 'In Progress',
    progress: 40
  }
];
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'error';
    case 'Medium': return 'warning';
    case 'Low': return 'success';
    default: return 'default';
    }
};
const getStatusColor = (status) => {
  switch (status) {
    case 'In Progress': return 'info';
    case 'Pending': return 'default';
    case 'Completed': return 'success';
    default: return 'default';
  }
}
const TaskTable = () => {
  const handleEdit = (id) => {
    console.log('Editing task:', id);
    // Add edit logic here
  };

  const handleDelete = (id) => {
    console.log('Deleting task:', id);
    // Add delete logic here
  };


  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Task Dashboard</Typography>
          {/* <Typography variant="subtitle2" color="text.secondary">Demo Preview</Typography> */}
        </Box>
        {/* <Button variant="contained" color="primary" size="small">
          Create New Task 
        </Button> */}
      </Box>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow style={{ backgroundColor: '#d3d3d3' }}>
            <TableCell style={{ fontWeight: 'bold'}}>Task</TableCell>
            <TableCell style={{ fontWeight: 'bold'}}>Assignee</TableCell>
            <TableCell style={{ fontWeight: 'bold'}}>Due Date</TableCell>
            <TableCell style={{ fontWeight: 'bold'}}>Priority</TableCell>
            <TableCell style={{ fontWeight: 'bold'}}>Status</TableCell>
            <TableCell style={{ fontWeight: 'bold'}}>Progress</TableCell>
            <TableCell style={{ fontWeight: 'bold'}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Box display="flex" alignItems="center" gap={2 }>
                <AssignmentTurnedInIcon style={{color:'#A7C7E7',backgroundColor:'#F0FFFF' }} />
                <Box>
                <Typography variant="body1">{row.task}</Typography> 
                <Typography variant="caption" color="text.secondary">ID: {row.id}</Typography>
                </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar style={{color:'#A7C7E7',backgroundColor:'#F0FFFF' }}>{row.assignee.initials}</Avatar>
                  <Typography>{row.assignee.name}</Typography>
                </Box>
              </TableCell>
             <TableCell>
                <Typography>{row.dueDate}</Typography>
                <Typography variant="caption" color={row.statusText === 'Overdue' ? 'error.main' : 'success.main'}>
                  {row.statusText}
                </Typography>
              </TableCell>
              <TableCell > <Chip label={row.priority} color={getPriorityColor(row.priority)} size="small" style={{width:75, borderRadius:7}}/>
              </TableCell>
              <TableCell > <Chip label={row.status} color={getStatusColor(row.status)} size="small" style={{width:100, borderRadius:7}} />
              </TableCell>
               <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <LinearProgress
                    variant="determinate"
                    value={row.progress}
                    sx={{ height: 8, borderRadius: 5, width:50 }}
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
                    <EditIcon fontSize="small" />Edit
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(row.id)}
                  >
                    <DeleteIcon fontSize="small" />Delete
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
  )
}

export default TaskTable
