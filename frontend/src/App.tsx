import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);

  // Initially fetch todo
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch('http://localhost:8080/');
        if (todos.status !== 200) {
          console.log('Error fetching data');
          return;
        }

        setTodos(await todos.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, []);

  const handleAddTodo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const title = (document.querySelector('input[name="title"]') as HTMLInputElement).value;
    const description = (document.querySelector('input[name="description"]') as HTMLInputElement).value;

    if (!title || !description) {
      alert('Please fill out all fields');
      return;
    }

    // Add todo to the server
    try {
      const response = await fetch('http://localhost:8080/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.status !== 200) {
        console.log('Error adding todo');
        return;
      }

      // Add todo to the local state
      setTodos([...todos, { title, description }]);

      // Clear input fields
      (document.querySelector('input[name="title"]') as HTMLInputElement).value = '';
      (document.querySelector('input[name="description"]') as HTMLInputElement).value = '';
    } catch (e) {
      console.log('Could not connect to server. Ensure it is running. ' + e);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) =>
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form>
        <input placeholder="Title" name="title" autoFocus={true} />
        <input placeholder="Description" name="description" />
        <button onClick={handleAddTodo}>Add Todo</button>
      </form>
    </div>
  );
}

export default App;