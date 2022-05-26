import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskForm from './TaskForm'
import TaskItem from './TaskItem';
import Select from 'react-select';

const TodoList = ({ tasks, onCreate, onUpdate, onDelete }) => {
  const defaultTask = { title: "", description: "", deadline: null, tags: [], priority: false, image: "", completed: false, id: null, createdAt: null };
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [sortedTasks, setSortedTasks] = useState(tasks);
  const [categorisedTasks, setCategorisedTasks] = useState({
    all: [],
    today: [],
    thisWeek: [],
    overDue: [],
    completed: [],
    priority: [],
    tags: []
  });

  const [title, setTitle] = useState('');

  const toggle = () => {
    setModal(!modal);
  }

  const addTask = (e) => {
    e.preventDefault();
    onCreate({ ...defaultTask, title, id: uuidv4(), createdAt: new Date().getTime() });
    setTitle('');
  }
  const handleInput = (e) => {
    setTitle(e.target.value)
  }

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
  const options = [{
    value: 'all',
    label: 'All'
  }, {
    value: 'completed',
    label: 'Completed'
  },]

  useEffect(() => {
    const selectedOptions = selected.map(({ value }) => value);
    if (selectedOptions.length > 0) {
      const filtered = tasks.filter(task => {
        if (selectedOptions.includes('completed')) {
          return task.completed
        }
        return true
      })
      setFilteredTasks(filtered)
    } else {
      setFilteredTasks(tasks)
    }
  }, [tasks, selected])

  useEffect(() => {
    setSortedTasks(sortTasks(filteredTasks))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTasks])

  useEffect(() => {
    const overDue = tasks.filter(task => {
      if (task.deadline && task.deadline < new Date().getTime()) {
        return true
      }
      return false
    })

    const completed = tasks.filter(task => task.completed);
    const priority = tasks.filter(task => task.priority);
    const today = tasks.filter(task => {
      if (task.deadline && task.deadline > new Date().getTime() && task.deadline < new Date().setDate(new Date().getDate() + 1)) {
        return true
      }
      return false
    })
    const thisWeek = tasks.filter(task => {
      if (task.deadline && task.deadline > new Date().getTime() && task.deadline < new Date().setDate(new Date().getDate() + 7)) {
        return true
      }
      return false
    })

    //filter tasks based on selected tags
    setCategorisedTasks({
      all: tasks,
      today,
      thisWeek,
      overDue,
      completed,
      priority
    });

  }, [tasks])


  return (
    <>
      <div className="todo-list-header">
        <form onSubmit={addTask} className='task-input-container'>  <input placeholder="Add task todo..." type="text" name="title" onChange={handleInput} value={title} />
          <button type="submit">Create Task</button>
        </form>
        <div className='task-input-container'>
          <button className="btn btn-primary mt-2" onClick={() => setModal(true)} >Create Detailed Task</button>
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

        {sortedTasks.length > 0 ? sortedTasks.map((task, index) => <TaskItem task={task} index={index} onDelete={onDelete} onUpdate={onUpdate} key={index} />) : <p style={{ textAlign: 'center' }}>No tasks to show</p>}
      </div>
      <TaskForm key={0} toggle={toggle} modal={modal} onCreate={onCreate}
        defaultTask={defaultTask} type="Create" />
    </>
  );
};

export default TodoList;