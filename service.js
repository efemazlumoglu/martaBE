const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, once, child, get, push, update, remove } = require('firebase/database');
const { getStorage, ref: storageRef, uploadBytes, getDownloadURL } = require('firebase/storage');

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
const storage = getStorage();
const PORT = process.env.PORT || 3000;

const uploadImageToStorage = async (filePath, userId, taskId) => {
  try {
      if (!fs.existsSync(filePath)) {
          throw new Error('File does not exist');
      }
      const imageType = path.extname(filePath).substring(1);
      const imageData = fs.readFileSync(filePath);
      const storageRefPath = `tasks/${userId}/${taskId}/uploadedImage`;
      const upload = await uploadBytes(storageRef(storage, storageRefPath), imageData, { contentType: 'image/jpeg' });
      console.log('file data:', upload);
      return upload;
  } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
  }
}

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
      console.log(taskId);
      console.log(taskData.taskImage);
      const snapshot = await push(child(ref(db), `tasks/${userId}/tasks`), taskData);
      if (taskData.taskImage) {
        const response = await uploadImageToStorage(taskData.taskImage.replace(/^file:\/\//, ''), userId, taskId);
      }
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
      console.log(taskData.taskImage);
      const snapshot = await update(child(ref(db),`tasks/${userId}/tasks/${taskId}`), taskData);
      if (taskData.taskImage) {
        const response = await uploadImageToStorage(taskData.taskImage.replace(/^file:\/\//, ''), userId, taskId);
      }
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

app.get('/tasks/:userId/:taskId/image', async (req, res) => {
  try {
      const userId = req.params.userId;
      const taskId = req.params.taskId;
      const storageRefPath = `tasks/${userId}/${taskId}/uploadedImage`;     
      const downloadURL = await getDownloadURL(storageRef(storage, storageRefPath));
      res.status(200).redirect(downloadURL);
  } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} \n http://localhost:3000`);
});