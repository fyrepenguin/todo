import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const defaultTask = {
    title: "",
    id: null,
    description: "",
    deadline: null,
    tags: [],
    priority: false,
    image: "",
    completed: false
  };

  const onCreate = newTask => {
    console.log({ newTask });
    newTask.title.length > 0 && setTasks([...tasks, newTask]);

  };
  const onUpdate = (task, id) => {
    console.log({ task, id })
    let tempList = tasks;
    let index = tasks.findIndex(t => t.id === id);
    console.log({ index })
    tempList[index] = task;
    console.log({ tempList, l: task.title.length })
    setTasks([...tempList]);
    console.log("updated?")
  };
  const onDelete = (id) => {
    let tempList = tasks.filter(task => task.id !== id);
    console.log({ tempList })
    setTasks(tempList);
  };

  useEffect(() => {
    let arr = localStorage.getItem("tasks");
    if (arr) {
      setTasks(JSON.parse(arr));
    }
  }, []);

  useEffect(() => {
    console.log("tasks updated")
    if (tasks && tasks.length > 0) {

      console.log("setting localStorage")
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);


  return (
    <div className="main-container">
      <header className="app-title">
        <h2>Todo </h2>
      </header>
      <TodoList tasks={tasks} onCreate={onCreate} onUpdate={onUpdate} onDelete={onDelete} defaultTask={defaultTask} />
    </div>
  );
}

export default App;
