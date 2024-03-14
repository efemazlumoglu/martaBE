const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp, database } = require('firebase/app');
const firebaseConfig = {
    apiKey: "AIzaSyCR8yWbCeLDNT6TcWhQRD7zUBg4F9Uwi6s",
    authDomain: "martatodotask.firebaseapp.com",
    databaseURL: "https://martatodotask-default-rtdb.firebaseio.com",
    projectId: "martatodotask",
    storageBucket: "martatodotask.appspot.com",
    messagingSenderId: "566524294971",
    appId: "1:566524294971:web:ba2ea8400f31623950291e",
    measurementId: "G-2GG5K0B9VW"
  };
initializeApp(firebaseConfig);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/tasks/:userId', async (res) => {
    try {
      const snapshot = await database().ref(`${userId}/tasks`).once('value');
      const tasks = snapshot.val();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
app.post('/tasks/:userId', async (req, res) => {
    try {
      const taskData = req.body;
      await database().ref(`${userId}/tasks`).push(taskData);
      res.json({ message: 'Task added successfully' });
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
app.put('/tasks/:userId/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
      const taskData = req.body;
      await database().ref(`${userId}/tasks/${taskId}`).update(taskData);
      res.json({ message: 'Task updated successfully' });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
app.delete('/tasks/:userId/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
      await database().ref(`${userId}/tasks/${taskId}`).remove();
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});