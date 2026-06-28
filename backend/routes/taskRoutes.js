const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const cron = require('node-cron');
const { sendNotification } = require('../firebase');

// Har minute due tasks check karo
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const fiveMinLater = new Date(now.getTime() + 5 * 60000);

    const dueTasks = await Task.find({
      dueDate: { $gte: now, $lte: fiveMinLater },
      status: { $ne: 'completed' },
      fcmToken: { $ne: null }
    });

    dueTasks.forEach(task => {
      sendNotification(
        task.fcmToken,
        '⏰ Task Due Soon!',
        `"${task.title}" is due in 5 minutes!`
      );
    });

    // Overdue tasks
    const overdueTasks = await Task.find({
      dueDate: { $lt: now },
      status: { $ne: 'completed' },
      fcmToken: { $ne: null },
      notified: { $ne: true }
    });

    overdueTasks.forEach(async task => {
      await sendNotification(
        task.fcmToken,
        '🚨 Task Overdue!',
        `"${task.title}" is now overdue!`
      );
      await Task.findByIdAndUpdate(task._id, { notified: true });
    });
  } catch (err) {
    console.error('Cron error:', err);
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;