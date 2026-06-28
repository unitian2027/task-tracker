import React, { useState, useEffect } from 'react';

function TaskForm({ onSubmit, editTask, cancelEdit }) {
  const [form, setForm] = useState({
    title: '', description: '', status: 'pending', priority: 'medium', dueDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setForm({
        ...editTask,
        dueDate: editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().slice(0, 16)
          : ''
      });
    } else {
      setForm({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' });
    }
  }, [editTask]);

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = 'Title is required!';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) { setErrors(err); return; }
    onSubmit(form);
    setForm({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' });
    setErrors({});
  };

  return (
    <div className="form-card">
      <h2>{editTask ? '✏️ Edit Task' : '➕ Add New Task'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Task Title *"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        {errors.title && <span className="error">{errors.title}</span>}

        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <label style={{fontSize:'13px', color:'#555', marginBottom:'4px', display:'block'}}>
          📅 Due Date & Time
        </label>
        <input
          type="datetime-local"
          value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
          style={{marginBottom:'10px'}}
        />

        <select value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <div className="form-btns">
          <button type="submit">{editTask ? 'Update Task' : 'Add Task'}</button>
          {editTask && <button type="button" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;