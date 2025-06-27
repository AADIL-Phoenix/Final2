const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Project = require('./model/project');
const Task = require('./model/task'); // Import the new Task model
const User = require('./model/user'); // Import the new User model
const bcrypt = require('bcrypt');

const app = new express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/newtask', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debugging log
    const { title, description, status, priority, dueDate, projectId, projectName,assignedToUserId, createdByUserId } = req.body;

    // Validate required fields
    if (!title || !projectId || !assignedToUserId || !createdByUserId) {
      return res.status(400).json({ message: 'Missing required fields: title, projectId, assignedToUserId, or createdByUserId' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      projectId: projectId.toString(),
      projectName: projectName.toString(), // Save as string
      assignedToUserId: assignedToUserId.toString(), // Save as string
      createdByUserId: createdByUserId.toString() // Save as string
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/task/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Update task
app.put('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, dueDate, projectId, projectName, assignedToUserId } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        status,
        priority,
        dueDate,
        projectId,
        projectName,
        assignedToUserId
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get single task by ID
app.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get all tasks
app.get('/task', async (req, res) => {
  try {
    const tasks = await Task.find(); // returns ALL tasks
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Update tasks for a user's project
app.patch('/api/tasks/user/:userId/project/:projectId', async (req, res) => {
  try {
    const { userId, projectId } = req.params;
    const { status, github } = req.body;
    
    const tasks = await Task.updateMany(
      { assignedToUserId: userId, projectId: projectId },
      { $set: { status, github } }
    );

    if (tasks.modifiedCount === 0) {
      return res.status(404).json({ message: 'No tasks found to update' });
    }

    res.json({ message: 'Tasks updated successfully' });
  } catch (err) {
    console.error('Error updating tasks:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get task metrics for a user
app.get('/api/tasks/metrics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ assignedToUserId: userId });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }

    const total = tasks.length;
    const metrics = {
      performance: {
        title: 'Team Performance',
        metrics: [
          { 
            name: 'Task Completion Rate', 
            value: `${Math.round((tasks.filter(t => t.status === 'done').length / total) * 100)}%`,
            change: '+5%'
          },
          { 
            name: 'Tasks This Week', 
            value: tasks.filter(t => {
              const taskDate = new Date(t.createdAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return taskDate >= weekAgo;
            }).length.toString(),
            change: '+3'
          },
          { 
            name: 'On-time Delivery', 
            value: `${Math.round((tasks.filter(t => new Date(t.dueDate) >= new Date()).length / total) * 100)}%`,
            change: '+2%'
          },
          { 
            name: 'In Progress', 
            value: tasks.filter(t => t.status === 'in-progress').length.toString(),
            change: '0'
          }
        ]
      },
      tasks: {
        title: 'Task Distribution',
        metrics: [
          { 
            name: 'Completed Tasks', 
            value: tasks.filter(t => t.status === 'done').length.toString(),
            change: '+0'
          },
          { 
            name: 'In Progress', 
            value: tasks.filter(t => t.status === 'in-progress').length.toString(),
            change: '+0'
          },
          { 
            name: 'Pending Tasks', 
            value: tasks.filter(t => t.status === 'to-do').length.toString(),
            change: '+0'
          },
          { 
            name: 'High Priority', 
            value: tasks.filter(t => t.priority === 'high').length.toString(),
            change: '+0'
          }
        ]
      },
      productivity: {
        title: 'Productivity Trends',
        metrics: [
          { 
            name: 'Weekly Output', 
            value: `${Math.round((tasks.filter(t => t.status === 'done').length / total) * 100)}%`,
            change: '↑'
          },
          { 
            name: 'Active Tasks', 
            value: tasks.filter(t => t.status !== 'done').length.toString(),
            change: '→'
          },
          { 
            name: 'Completion Rate', 
            value: `${Math.round((tasks.filter(t => t.status === 'done').length / total) * 100)}%`,
            change: '↑'
          },
          { 
            name: 'Task Balance', 
            value: total > 0 ? 'Good' : 'N/A',
            change: '→'
          }
        ]
      }
    };

    res.json(metrics);
  } catch (err) {
    console.error('Error fetching task metrics:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Get tasks by user ID
app.get('/api/tasks/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all tasks assigned to that userId directly
    const tasks = await Task.find({ assignedToUserId: userId });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this user' });
    }
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks for user:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/newuser', async (req, res) => {
  try {
    const { username, email, role, userId } = req.body;

    // Validate required fields
    if (!username || !email || !role || !userId) {
      return res.status(400).json({ message: 'Missing required fields: username, email, role, or userId' });
    }

    const newUser = new User({
      username,
      email,
      role,
      userId
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Deleting user with userId:', userId);
    const deletedUser = await User.findOneAndDelete({ userId });
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Internal Server Error');
  }
});

// New GET API for users
app.get('/user', async(req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users); // Send users as JSON
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Internal Server Error');
  }
});

mongoose.connect('mongodb+srv://Nexus:nexus4@bookclubcluster.qiwnm.mongodb.net/taskmanagerDB?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
