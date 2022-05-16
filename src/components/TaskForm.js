import React, { useState, useEffect } from 'react';
import { Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
    <Modal isOpen={modal} toggle={toggle} key={task.name}>
      <ModalHeader toggle={toggle}>{type} Task</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="title">
            Title
          </Label>
          <Input type="text" name="title" value={task.title} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="deadline">Deadline</Label>
          <DatePicker
            selected={task.deadline}
            onChange={(date) => setTask(prev => ({ ...prev, deadline: date }))}
            showTimeSelect
            dateFormat="Pp"
            placeholderText='Deadline...'
            todayButton="Today"
            value={task.deadline}
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">
            Description
          </Label>
          <Input type="textarea" name="description" value={task.description} onChange={handleChange} />
        </FormGroup>
        <FormGroup check>
          <Input type="checkbox" />
          <Label check>
            Priority
          </Label>
        </FormGroup>

        <div>
          <label htmlFor="tags">
            Tags
          </label>
          <div>
            <Select options={tags.map(tag => ({ value: tag.name, label: tag.name, ...tag }))} isMulti onChange={(selectedOption) => setTask(prev => ({ ...prev, tags: selectedOption.map(({ id, name }) => ({ id, name })) }))} />
          </div>


        </div>
        <FormGroup>
          <Label for="image">
            Image
          </Label>
          <Input
            id="image"
            name="image"
            type="file"
            onChange={onImageChange}
            value={task.image}
          />
        </FormGroup>

      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>{type === "Create" ? "Create" : "Update"}</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default TaskForm;