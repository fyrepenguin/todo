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
    newTask.title.length > 0 && setTasks([...tasks, newTask]);

  };
  const onUpdate = (task, id) => {
    let tempList = tasks;
    let index = tasks.findIndex(t => t.id === id);
    tempList[index] = task;
    setTasks([...tempList]);
  };
  const onDelete = (id) => {
    let tempList = tasks.filter(task => task.id !== id);
    setTasks(tempList);
  };

  useEffect(() => {
    let arr = localStorage.getItem("tasks");
    if (arr) {
      setTasks(JSON.parse(arr));
    }
  }, []);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
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
