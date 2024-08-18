import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const Home = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState("");

	useEffect(() => {
		fetch('https://playground.4geeks.com/todo/users/vchoupina')
			.then(resp => resp.json())
			.then(data => {
				if (Array.isArray(data)) {
					setTodos(data); // Atualiza o estado se for um array
				} else {
					setTodos([]); // Define um array vazio se o dado retornado não for um array
				}
			})
			.catch(error => console.error('Error fetching todos:', error));
	}, []);

	const syncTodosWithServer = (updatedTodos) => {
		fetch('https://playground.4geeks.com/todo/users/vchoupina', {
			method: "PUT",
			body: JSON.stringify(updatedTodos),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => resp.json())
			.then(data => {
				console.log('Synced successfully:', data);
			})
			.catch(error => console.error('Error syncing todos:', error));
	};

	// Nova tarefa
	const handleAddTodo = (e) => {
		if (e.key === "Enter" && newTodo.trim() !== "") {
			const updatedTodos = [...todos, newTodo];
			setTodos(updatedTodos);
			setNewTodo("");
			syncTodosWithServer(updatedTodos); 
		}
	};

	// Eliminar tarefa
	const handleRemoveTodo = (index) => {
		const updatedTodos = todos.filter((todo, i) => i !== index);
		setTodos(updatedTodos);
		syncTodosWithServer(updatedTodos); 
	};

	// Limpar todas as tarefas
	const handleClearTodos = () => {
		setTodos([]);
		syncTodosWithServer([]); // Sincronizar com o backend após limpar todas as tarefas
	};

	return (
		<div className="container">
			<h1>To Do</h1>
			<div className="content">
				<input
					type="text"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					onKeyDown={handleAddTodo}
					placeholder="What needs to be done?"
				/>
				<ul>
					{todos.length === 0 ? (
						<li className="no-tTasks">No tasks yet</li>
					) : (
						todos.map((todo, index) => (
							<li key={index} className="todo-item">
								{todo}
								<span
									className="remove-icon"
									onClick={() => handleRemoveTodo(index)}
								>
									X
								</span>
							</li>
						))
					)}
				</ul>
				<div className="footer">
					{todos.length > 0 && (
						<>
							<span>{todos.length} item{todos.length > 1 && "s"} left</span>
							<button onClick={handleClearTodos} className="clear-btn">
								Clear all tasks
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
