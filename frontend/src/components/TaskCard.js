import React from 'react';

const priorityColors = { low: '#28a745', medium: '#ffc107', high: '#dc3545' };
const statusColors = { pending: '#6c757d', 'in-progress': '#007bff', completed: '#28a745' };

function TaskCard({ task, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="task-card" style={{ borderLeft: isOverdue ? '4px solid #dc3545' : '4px solid transparent' }}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="badges">
          <span style={{ background: priorityColors[task.priority] }}>{task.priority}</span>
          <span style={{ background: statusColors[task.status] }}>{task.status}</span>
        </div>
      </div>

      {task.description && <p>{task.description}</p>}

      {task.dueDate && (
        <p style={{ fontSize: '13px', color: isOverdue ? '#dc3545' : '#888', marginBottom: '10px' }}>
          {isOverdue ? '⚠️ Overdue: ' : '📅 Due: '}{formatDate(task.dueDate)}
        </p>
      )}

      <div className="task-actions">
        <button onClick={() => onEdit(task)}>✏️ Edit</button>
        <button onClick={() => onDelete(task._id)} className="delete">🗑️ Delete</button>
      </div>
    </div>
  );
}

export default TaskCard;