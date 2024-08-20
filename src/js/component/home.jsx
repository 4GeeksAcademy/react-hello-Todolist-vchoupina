import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const Home = () => {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState("");

	const getTodos = ()=>{
		fetch('https://playground.4geeks.com/todo/users/vchoupina')
			.then(resp => {
				if (!resp.ok) {
					CreateNewList()
				} else{return resp.json()}
			})
			.then(data => {
				console.log(data)
				if (Array.isArray(data.todos)) {
					setTodos(data.todos); // Atualiza o estado se for um array
				} else {
					setTodos([]); // Define um array vazio se o dado retornado não for um array
				}
			})
			.catch(error => console.error('Error fetching todos:', error));
	}

		const CreateNewList = ()=>{
			fetch('https://playground.4geeks.com/todo/users/vchoupina', {method: "POST"}) 
			.then(resp => {
				return resp.json()
			})
			.then(data => {
				getTodos();
				
			})
			.catch(error => console.error('Error fetching todos:', error));
		}
	useEffect(() => {
		getTodos();
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
			fetch("https://playground.4geeks.com/todo/todos/vchoupina", {
				method: "POST",
				body: JSON.stringify({
					"label": newTodo, 
					"is_done": false
				}), 
				headers: {"Content-Type": "application/json"}
			})
			.then(resp => resp.json())
			.then(data => {
				getTodos()
				setNewTodo("") 
			})
		}
	};

	// Eliminar tarefa
	const handleRemoveTodo = (index) => {
		const todoId = todos[index].id; // Obtém o ID do todo que será deletado
		fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
			method: 'DELETE'
		})
		.then(resp => {
			if (!resp.ok) {
				throw new Error('Erro ao deletar o todo');
			}
			console.log(`Todo com id ${todoId} deletado com sucesso`);
			const updatedTodos = todos.filter((todo, i) => i !== index);
			setTodos(updatedTodos);
		})
		.catch(error => console.error('Erro ao deletar o todo:', error));
	};

	// Limpar todas as tarefas
	const handleClearTodos = () => {
		fetch('https://playground.4geeks.com/todo/users/vchoupina', {
			method: 'DELETE'
		})
		.then(resp => {
			if (!resp.ok) {
				throw new Error('Erro ao deletar todos os todos do usuário');
			}
			console.log('Todos deletados com sucesso');
			setTodos([]); // Limpa o estado local após a deleção no servidor
		})
		.catch(error => console.error('Erro ao deletar os todos:', error));
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
								{todo.label}
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
