import React, { useState } from 'react';
import TaskForm from './TaskForm'
import { Button } from 'reactstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { useEffect } from 'react';
const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState();

  const toggle = () => {
    setModal(!modal);
  }

  const handleStatus = (e) => {
    setStatus(e.target.checked)

  }

  const handleDelete = () => {
    console.log(task.id)
    onDelete(task.id)
  }
  useEffect(() => {
    setStatus(task.completed)
  }, [task])
  useEffect(() => {
    status && onUpdate({ ...task, completed: status }, task.id)
  }, [status])

  return (
    <>
      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        <input type="checkbox" checked={status} onChange={handleStatus} />
        <p style={{ textDecoration: status ? 'line-through' : 'none' }}>{task.title} </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button onClick={() => setModal(true)}>
            <FaEdit />
          </Button>
          <Button onClick={handleDelete} >
            <FaTrashAlt />
          </Button>
        </div>
      </div>
      <TaskForm key={task.id} modal={modal}
        defaultTask={task} toggle={toggle} onUpdate={onUpdate} task={task} type="Edit" />
    </>
  );
};

export default TaskItem;