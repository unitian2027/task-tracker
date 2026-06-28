import React from 'react';
import TaskCard from './TaskCard';

function TaskList({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0)
    return <p className="empty">No tasks found! Add one above ☝️</p>;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard key={task._id} task={task}
          onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default TaskList;