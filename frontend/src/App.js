import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { requestPermission, onMessageListener } from './firebase';
import './App.css';

const API = 'https://task-tracker-5om2.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();

    const initFCM = async () => {
      const token = await requestPermission();
      if (token) {
        localStorage.setItem('fcmToken', token);
      }
    };
    initFCM();

    onMessageListener().then(payload => {
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body
      });
      setTimeout(() => setNotification(null), 5000);
    });
  }, []);

  const addTask = async (taskData) => {
    const token = localStorage.getItem('fcmToken');
    await axios.post(API, { ...taskData, fcmToken: token });
    fetchTasks();
  };

  const updateTask = async (id, taskData) => {
    const token = localStorage.getItem('fcmToken');
    await axios.put(`${API}/${id}`, { ...taskData, fcmToken: token });
    setEditTask(null);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  return (
    <div className="app">
      <h1>📝 Task Tracker</h1>

      {notification && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px',
          background: '#333', color: 'white', padding: '16px 20px',
          borderRadius: '12px', zIndex: 9999, maxWidth: '300px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <strong>{notification.title}</strong>
          <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{notification.body}</p>
        </div>
      )}

      <TaskForm
        onSubmit={editTask ? (data) => updateTask(editTask._id, data) : addTask}
        editTask={editTask}
        cancelEdit={() => setEditTask(null)}
      />

      <div className="filters">
        {['all', 'pending', 'in-progress', 'completed'].map(f => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <TaskList
        tasks={filteredTasks}
        onEdit={setEditTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

export default App;