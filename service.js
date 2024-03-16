const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, once, child, get, push, update, remove } = require('firebase/database');
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
const db = getDatabase();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/tasks/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
          return res.status(400).json({ error: 'User ID is undefined' });
      } else {
        const snapshot = await get(child(ref(db), `tasks/${userId}/tasks`));
        const tasks = snapshot.val();
        console.log('fetching tasks are working');
        res.json(tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
app.post('/tasks/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const taskData = req.body;
      const snapshot = await push(child(ref(db), `tasks/${userId}/tasks`), taskData);
      res.status(200).json({ message: 'Task added successfully' });
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
app.put('/tasks/:userId/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const userId = req.params.userId;
      const taskData = req.body;
      console.log(taskId);
      const snapshot = await update(child(ref(db),`tasks/${userId}/tasks/${taskId}`), taskData);
      res.json({ message: 'Task updated successfully' });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
app.delete('/tasks/:userId/:taskId', async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const userId = req.params.userId;
      const snapshot = await remove(child(ref(db),`tasks/${userId}/tasks/${taskId}`));
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} \n http://localhost:3000`);
});