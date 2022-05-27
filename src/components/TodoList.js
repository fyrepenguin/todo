import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskForm from './TaskForm'
import TaskItem from './TaskItem';
import tags from '../tags.json';
import Select from 'react-select';

const TodoList = ({ tasks, onCreate, onUpdate, onDelete }) => {
  const defaultTask = { title: "", description: "", deadline: null, tags: [], priority: false, image: "", completed: false, id: null, createdAt: null };
  const [modal, setModal] = useState(false);
  const [filters, setFilters] = useState({
    status: null,
    tags: []
  });
  const [sortOrder, setSortOrder] = useState({ value: 'desc', label: 'Desc' });
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
  const sortTasksByCreatedAt = (tasks) => {
    // sort based on sort order
    return tasks.sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      if (sortOrder.value === "asc") {

        return aDate - bDate;
      } else if (sortOrder.value === "desc") {
        return bDate - aDate;
      }
      return 0
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
    const filteredTasksWithStatus = tasks.filter(task => {
      if (filters.status?.value === 'completed') {
        return task.completed
      }
      return true
    })
    if (filters.tags.length > 0) {
      const selectTags = filters.tags.map(({ value }) => value);
      const filteredWithTags = filteredTasksWithStatus.filter(({ tags }) =>
        tags.length > 0);

      const filtered = filteredWithTags.filter(({ tags }) => {
          return tags.some(tag => selectTags.includes(tag.name));
      });
      setFilteredTasks(filtered);
      return;
    }
    setFilteredTasks(filteredTasksWithStatus);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, tasks])

  useEffect(() => {
    const sorted = sortTasks(filteredTasks)
    setSortedTasks([...sorted])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTasks, sortOrder])



  useEffect(() => {
    const overDue = sortedTasks.filter(task => {
      if (task.deadline && task.deadline < new Date().getTime() && !task.completed) {
        return true
      }
      return false
    })

    const completed = sortedTasks.filter(task => task.completed);
    const priority = sortedTasks.filter(task => task.priority);

    const today = sortedTasks.filter(task => {
      if (task.deadline && task.deadline > new Date().getTime() && task.deadline < new Date().setDate(new Date().getDate() + 1)) {
        return true
      }
      return false
    })
    const thisWeek = sortedTasks.filter(task => {
      if (task.deadline && task.deadline > new Date().getTime() && task.deadline < new Date().setDate(new Date().getDate() + 7)) {
        return true
      }
      return false
    });


    //filter tasks based on selected tags
    setCategorisedTasks(prev => ({
      all: tasks,
      today,
      thisWeek,
      overDue,
      completed,
      priority,
      tags: prev.tags
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedTasks])

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
            <h4>Filters: </h4>
            <div>
              <label htmlFor="filter"> By Status:</label>
            <Select
              options={options}
                isClearable={true}
                onChange={(selectedOption) => setFilters(prev => ({ ...prev, status: selectedOption }))}
                value={filters.status}>

            </Select>
            </div>
            <div>
              <label htmlFor="filter"> By Tags:</label>
              <Select
                options={tags.map(tag => ({ value: tag.name, label: tag.name, ...tag }))}
                isMulti
                onChange={(selectedOption) => {
                  setFilters(prev => ({ ...prev, tags: [...selectedOption] }))
                }}
                value={filters.tags}
              />
            </div>
            <div>
              <label htmlFor="filter">Sort By:</label>
              <Select
                options={[{ value: 'asc', label: 'Asc' }, { value: 'desc', label: 'Desc' }]}
                onChange={(selectedOption) => {
                  setSortOrder(selectedOption)
                }}
                value={sortOrder}
              />
            </div>
          </div>

        </div>
      </div>
      <div className="tasks-container">
        {/* Today Tasks */}
        {categorisedTasks.today.length > 0 && <div className="tasks-container-header">
          <h3>Today</h3>
          {categorisedTasks.today.filter(task => !task.completed).map((task, index) => <TaskItem task={task} index={index} onDelete={onDelete} onUpdate={onUpdate} key={index} />)}</div>}
        {/* This Week Tasks */}
        {categorisedTasks.thisWeek.filter(task => !task.completed).filter(task => !categorisedTasks.today.includes(task)).length > 0 && <div className="tasks-container-header">
          <h3>This Week</h3>
          {/* filter today tasks */}
          {categorisedTasks.thisWeek.filter(task => !categorisedTasks.today.includes(task)).map((task, index) => <TaskItem task={task} index={index} onDelete={onDelete} onUpdate={onUpdate} key={index} />)}</div>}

        {/* Overdue Tasks */}
        {categorisedTasks.overDue.length > 0 && <div className="tasks-container-header">
          <h3>Overdue</h3>
          {categorisedTasks.overDue.map((task, index) => <TaskItem task={task} index={index} onDelete={onDelete} onUpdate={onUpdate} key={index} />)}</div>}
        {sortedTasks.length > 0 &&
          <div className='tasks-container-header'>
            {sortedTasks.filter(task => !task.completed).filter(task => !categorisedTasks.today.includes(task)).filter(task => !categorisedTasks.thisWeek.includes(task)).map((task, index) => <TaskItem task={task} index={index} onDelete={onDelete} onUpdate={onUpdate} key={index} />)} </div>}
        {/* Completed Tasks */}
        {categorisedTasks.completed.length > 0 && <div className="tasks-container-header">
          <h3>Completed</h3>
          {categorisedTasks.completed.map((task, index) => <TaskItem task={task} index={index} onDelete={onDelete} onUpdate={onUpdate} key={index} />)}</div>}
      </div>
      <TaskForm key={0} toggle={toggle} modal={modal} onCreate={onCreate}
        defaultTask={defaultTask} type="Create" />
    </>
  );
};

export default TodoList;