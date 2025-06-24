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


// New GET API for tasks
app.get('/task', async (req, res) => {
  try {
    const tasks = await Task.find(); // returns ALL tasks
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
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
