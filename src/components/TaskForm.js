import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid';
import "react-datepicker/dist/react-datepicker.css";
import tags from '../tags.json';

const TaskForm = ({ modal, toggle, onCreate, task: taskData, defaultTask, type = "Create", onUpdate }) => {
  const [task, setTask] = useState({ ...defaultTask, id: uuidv4() });


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (!["tags", "image", "deadline"].includes(name)) {
      setTask(prev => ({ ...prev, [name]: value }))
    }
  }
  const handlePriority = (e) => {
    const { checked } = e.target;
    setTask(prev => ({ ...prev, priority: checked }))
  }

  const onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setTask(prev => ({ ...prev, image: URL.createObjectURL(img) }));;
    }
  };
  // const onTagsChange = (e) => {
  //   const { value } = e.target;
  //   console.log({ value, tags: task.tags })

  //   if (task.tags.includes(value)) {
  //     console.log("includes", value)
  //     setTask(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== value) }));
  //   } else {
  //     console.log("not", value)
  //     setTask(prev => ({ ...prev, tags: [...prev.tags, value] }));
  //   }
  // }
  // const onDeadlineChange = (e,) => {
  //   const { value } = e.target;
  //   console.log({ value })
  //   setTask(prev => ({ ...prev, deadline: { value } }));
  // }

  const handleSave = (e) => {
    e.preventDefault()
    type === "Create" ? onCreate(task) : onUpdate(task, task.id)
    toggle()

  }
  useEffect(() => {
    if (taskData) {
      setTask(taskData)
    }
  }, [taskData])

  return (
    <div>
      <div className={`modal ${modal ? 'open' : ''}`} id="modal">
        <div className="modal-content">
          <button onClick={toggle} className="modal-close" title="Close Modal">X</button>
          <h3>{type} Task</h3>
          <div className="modal-area">
            <div className='modal-body'>
              <div className='modal-form'>
                <div className="form-group" >
                  <label htmlFor="title">
                    Task
                  </label>
                  <input type="text" name="title" value={task.title} onChange={handleChange} />
                </div>
                <div className="form-group" >
                  <label htmlFor="deadline">Deadline</label>
                  <DatePicker
                    selected={task.deadline ? new Date(task.deadline) : null}
                    onChange={(date) => setTask(prev => ({ ...prev, deadline: date }))}
                    showTimeSelect
                    dateFormat="Pp"
                    todayButton="Today"
                    value={task.deadline ? new Date(task.deadline) : null}
                  />
                </div>
                <div className="form-group" >
                  <label htmlFor="description">
                    Description
                  </label>
                  <input type="textarea" name="description" value={task.description} onChange={handleChange} />
                </div>
                <div className="form-group priority-input-container" check>
                  <input type="checkbox" id="priority" name="priority" onChange={handlePriority} checked={task.priority} />
                  <label htmlFor='priority'>
                    Priority
                  </label>
                </div>

                <div className='form-group'>
                  <label htmlFor="tags">
                    Tags
                  </label>
                  <div>
                    <Select
                      options={tags.map(tag => ({ value: tag.name, label: tag.name, ...tag }))}
                      isMulti
                      onChange={(selectedOption) => setTask(prev => ({ ...prev, tags: selectedOption.map(({ id, name }) => ({ id, name })) }))}
                      value={task.tags.map(tag => ({ value: tag.name, label: tag.name, ...tag }))}
                    />
                  </div>


                </div>
                <div className="form-group" >
                  <label htmlFor="image">
                    Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    onChange={onImageChange}
                    value={task.image}
                  />
                </div>

              </div>
              <footer>
                <button className="primary" onClick={handleSave}>{type === "Create" ? "Create" : "Update"}</button>
                <button className="secondary" onClick={toggle}>Cancel</button>
              </footer>
            </div>
          </div>
        </div>
      </div>
      {/* {  <ModalContainer isOpen={modal} toggle={toggle} key={task.name}>
      <ModalHeader toggle={toggle}></ModalHeader>
      <ModalBody>

    </ModalContainer>} */}
    </div>
  );
};

export default TaskForm;