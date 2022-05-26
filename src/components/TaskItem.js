import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { FiCircle, FiCheckCircle } from 'react-icons/fi'


const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState(null);

  const toggle = () => {
    setModal(!modal);
  }

  const handleStatus = (e) => {
    setStatus(prev => !prev);
  }

  const handleDelete = () => {
    onDelete(task.id)
  }
  useEffect(() => {
    setStatus(task.completed)
  }, [task])

  useEffect(() => {
    status !== null && onUpdate({ ...task, completed: status }, task.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <>
      <div className="task-item">
        <div onClick={handleStatus} className="task-header">
          <div className="status-icon-container">
            {status ? <FiCheckCircle className='completed-icon' /> : <FiCircle />}
          </div>
          <h4 style={{ textDecoration: status ? 'line-through' : 'none', hyphens: 'auto' }}>{task.title.length > 100 ? `${task.title.slice(0, 100)}...` : task.title} </h4>
        </div>


        <div className='task-item-buttons-container'>
          {!task.completed && <button className='edit-button' onClick={() => setModal(true)} style={{ lineHeight: '1', background: 'none', border: 'none' }}>
            <FaEdit />
          </button>}
          <button onClick={handleDelete} className="delete-button" >
            <FaTrashAlt />
          </button>
        </div>
      </div>
      <TaskForm key={task.id} modal={modal}
        defaultTask={task} toggle={toggle} onUpdate={onUpdate} task={task} type="Edit" />
    </>
  );
};

export default TaskItem;