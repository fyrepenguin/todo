import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskForm from './TaskForm'
import TaskItem from './TaskItem';
import Select from 'react-select';

const TodoList = ({ tasks, onCreate, onUpdate, onDelete }) => {
  const defaultTask = { title: "", description: "", deadline: null, tags: [], priority: false, image: "", completed: false, id: null, createdAt: null };
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  const options = [{
    value: 'all',
    label: 'All'
  }, {
    value: 'completed',
    label: 'Completed'
  }, {
    value: 'incomplete',
    label: 'Incomplete'
  }]
  const [title, setTitle] = useState('');

  const toggle = () => {
    setModal(!modal);
  }

  const addTask = () => {
    onCreate({ ...defaultTask, title, id: uuidv4(), createdAt: new Date().getTime() });
    setTitle('');
  }
  const handleInput = (e) => {
    setTitle(e.target.value)
  }

  useEffect(() => {
    const selectedOptions = selected.map(({ value }) => value);
    if (selectedOptions.length > 0) {
      const filtered = tasks.filter(task => {
        if (selectedOptions.includes('completed')) {
          return task.completed
        } else if (selectedOptions.includes('incomplete')) {
          return !task.completed
        } else {
          return true
        }
      })
      setFilteredTasks(filtered)
    } else {
      setFilteredTasks(tasks)
    }
  }, [tasks, selected])


  // push tasks that are completed to the bottom of the list
  const sortTasksByStatus = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.completed && !b.completed) {
        return 1
      } else if (!a.completed && b.completed) {
        return -1
      } else {
        return 0
      }
    })
  }

  const sortTasksByCreatedAt = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1
      } else if (a.createdAt < b.createdAt) {
        return 1
      } else {
        return 0
      }
    })
  }

  const sortTasksByPriority = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.priority && !b.priority) {
        return -1
      } else if (!a.priority && b.priority) {
        return 1
      } else {
        return 0
      }
    })
  }

  const sortTasks = (tasks) => {
    return sortTasksByStatus(sortTasksByPriority(sortTasksByCreatedAt(tasks)))
  }

  useEffect(() => {
    setFilteredTasks(sortTasks(tasks))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks])



  return (
    <>
      <div className="todo-list-header">
        <div className='task-input-container'>
          <input placeholder="Add task todo..." type="text" name="title" onChange={handleInput} value={title} />
          <button onClick={addTask}>Create Task</button>
          {/* <button className="btn btn-primary mt-2" onClick={() => setModal(true)} >Create Task</button> */}
        </div>
        {/* filters */}
        <div className="filters-container">
          <div><h3>Tasks</h3></div>
          <div className='status-filter'>
            <label htmlFor="filter">Filter:</label>
            <Select
              options={options}
              isMulti
              onChange={(selectedOption) => setSelected([...selectedOption])}
              value={selected}>

            </Select>
          </div>

        </div>
      </div>
      <div className="tasks-container">

        {filteredTasks && filteredTasks.map((task, index) => <TaskItem task={task} index={index} onDelete={onDelete} onUpdate={onUpdate} key={index} />)}
      </div>
      <TaskForm key={0} toggle={toggle} modal={modal} onCreate={onCreate}
        defaultTask={defaultTask} type="Create" />
    </>
  );
};

export default TodoList;