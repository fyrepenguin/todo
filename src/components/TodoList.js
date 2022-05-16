import React, { useEffect, useId, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, InputGroup, Input } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import TaskForm from './TaskForm'
import TaskItem from './TaskItem';
import tags from '../tags.json'

const TodoList = ({ tasks, onCreate, onUpdate, onDelete }) => {
  const defaultTask = { title: "", description: "", deadline: "", tags: [], priority: false, image: "", completed: false, id: null }
  const [modal, setModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');

  console.log({ tasks })


  const toggle = () => {
    setModal(!modal);
  }
  const dropDownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  }

  const addTask = () => {
    onCreate({ ...defaultTask, title, id: uuidv4() })
  }
  const handleInput = (e) => {
    setTitle(e.target.value)
  }

  useEffect(() => {

  }, [tasks])



  return (
    <>
      <div className="header text-center">
        <h3 >Tasks</h3>
        <InputGroup style={{ maxWidth: '1280px', padding: '0 2rem' }}>
          <Input placeholder="I want to..." type="text" name="title" onChange={handleInput} value={title} />
          <Button onClick={addTask}>+</Button>
        </InputGroup>
        <button className="btn btn-primary mt-2" onClick={() => setModal(true)} >Create Task</button>
      </div>
      <div className="task-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
          <h3>Tasks List</h3>
          <div className="d-flex justify-content-center ">
            <Dropdown toggle={() => dropDownToggle()} isOpen={dropdownOpen}>
              <DropdownToggle caret>
                <FaFilter />
              </DropdownToggle>
              <DropdownMenu
              >
                <DropdownItem header>
                  Time
                </DropdownItem>
                <DropdownItem>
                  Today
                </DropdownItem>
                <DropdownItem>
                  This Week
                </DropdownItem>
                <DropdownItem>
                  Overdue
                </DropdownItem>
                <DropdownItem>
                  Not Scheduled
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem header>
                  Tags
                </DropdownItem>
                {tags.map(tag => <DropdownItem key={tag.name} >
                  {tag.name}
                </DropdownItem>)}
                <DropdownItem divider />
                <DropdownItem header>
                  Status
                </DropdownItem>
                <DropdownItem>
                  Completed
                </DropdownItem>
                <DropdownItem>
                  Not Completed
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {tasks && tasks.map((task, index) => <TaskItem task={task} index={index} onDelete={onDelete} onUpdate={onUpdate} key={index} />)}
      </div>
      <TaskForm key={0} toggle={toggle} modal={modal} onCreate={onCreate}
        defaultTask={defaultTask} type="Create" />
    </>
  );
};

export default TodoList;