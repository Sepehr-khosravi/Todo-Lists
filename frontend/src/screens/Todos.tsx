import { useState, useEffect } from 'react';
import "./styles/todos.css";
import TodoItem from '../components/Todo';
import dataConfig from '../config';
import axios from 'axios';

// typeasa
export interface Todo {
    id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
}

export type TodoStatus = Todo['status'];

export interface CreateTodoData {
    title: string;
    description: string;
}

export interface UpdateTodoData {
    title?: string;
    description?: string;
    status?: TodoStatus;
}

const todoService = {
    getTodos: async (): Promise<Todo[]> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return [];
            }
            const api: string = dataConfig.Server_Address + dataConfig.Api.Todo.Get;
            const response = await axios.get(api, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response || !response.data) {
                return [];
            }
            return response.data.data || [];
        } catch (e: any) {
            console.error("GetTodo Error : ", e);
            return [];
        }
    },

    createTodo: async (data: CreateTodoData): Promise<Todo> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('No token found');
            }
            const api: string = dataConfig.Server_Address + dataConfig.Api.Todo.Add;
            const response = await axios.post(api, data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response || !response.data) {
                throw new Error('No response data');
            }
            return response.data.data;
        }
        catch (e: any) {
            console.error("createTodo Error : ", e);
            throw new Error('Failed to create todo');
        }
    },

    updateTodo: async (id: string, data: UpdateTodoData): Promise<Todo> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('No token found');
            }
            const api = dataConfig.Server_Address + dataConfig.Api.Todo.Edit;

            const payload = {
                todoId: id,
                title: data.title, 
                description: data.description, 
                status: data.status || 'PENDING'
            };

            const response = await axios.post(api, payload, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response || !response.data) {
                throw new Error('No response data');
            }

            return response.data.data;
        } catch (e: any) {
            console.log("updateTodo Error : ", e);
            throw new Error('Failed to update todo');
        }
    },

    deleteTodo: async (id: string): Promise<void> => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error('No token found');
            }
            const api = dataConfig.Server_Address + dataConfig.Api.Todo.Delete;
            const response = await axios.post(api, { todoId: id }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response || !response.data) {
                throw new Error("Connection Error!");
            }
        }
        catch (e: any) {
            console.error("deleteTodo Error : ", e);
            throw new Error('Failed to delete todo');
        }
    },
};

export default function Todos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newTodo, setNewTodo] = useState<CreateTodoData>({
        title: '',
        description: ''
    });

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await todoService.getTodos();
            setTodos(data || []);
        } catch (err: any) {
            setError('Failed to load todos');
            console.error('Error loading todos:', err);
        } finally {
            setLoading(false);
        }
    };

    // Create new todo
    const handleCreateTodo = async () => {
        if (!newTodo.title.trim()) return;

        try {
            setError(null);
            const createdTodo = await todoService.createTodo(newTodo);
            setTodos(prev => [...prev, createdTodo]);
            setNewTodo({ title: '', description: '' });
        } catch (err: any) {
            setError('Failed to create todo: ' + err.message);
            console.error('Error creating todo:', err);
        }
    };

    const handleUpdateTodo = async (id: string, data: UpdateTodoData) => {
        try {
            setError(null);
            const updatedTodo = await todoService.updateTodo(id, data);
            if (updatedTodo && typeof updatedTodo === 'object' && 'id' in updatedTodo) {
                setTodos(prev => prev.map(todo =>
                    todo.id === id ? updatedTodo as Todo : todo
                ));
            } else {
                setTodos(prev => prev.map(todo =>
                    todo.id === id ? {
                        ...todo,
                        ...data
                    } : todo
                ));
            }
        } catch (err: any) {
            setError('Failed to update todo: ' + err.message);
            console.error('Error updating todo:', err);
            throw err;
        }
    };

    // Delete todo
    const handleDeleteTodo = async (id: string) => {
        try {
            setError(null);
            await todoService.deleteTodo(id);
            setTodos(prev => prev.filter(todo => todo.id !== id));
        } catch (err: any) {
            setError('Failed to delete todo: ' + err.message);
            console.error('Error deleting todo:', err);
        }
    };

    const completedCount = todos.filter(todo => todo.status === 'DONE').length;
    const totalCount = todos.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    if (loading) {
        return (
            <div className="todos-wrapper">
                <div className="todos-container">
                    <div className="loading">Loading todos...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="todos-wrapper">
            <div className="todos-container">
                <div className="todos-header">
                    <h1>📝 My Todo List</h1>
                    <p>Manage your daily tasks efficiently</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={() => setError(null)} className="dismiss-btn">×</button>
                    </div>
                )}

                <div className="add-todo-section">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Add a new task title..."
                            className="todo-input"
                            value={newTodo.title}
                            onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateTodo()}
                        />
                        <button
                            onClick={handleCreateTodo}
                            className="add-btn"
                            disabled={!newTodo.title.trim()}
                        >
                            ➕ Add Task
                        </button>
                    </div>
                </div>

                <div className="progress-section">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="progress-stats">
                        <span>{completedCount} of {totalCount} completed</span>
                    </div>
                </div>

                <div className="todos-list">
                    {todos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No todos yet</h3>
                            <p>Add your first task to get started!</p>
                        </div>
                    ) : (
                        todos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onUpdate={handleUpdateTodo}
                                onDelete={handleDeleteTodo}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}