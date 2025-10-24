
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

// API Service Functions
const todoService = {
  getTodos: async (): Promise<Todo[]> => {
    // TODO: Implement API call
    return [];
  },

  createTodo: async (data: CreateTodoData): Promise<Todo> => {
    // TODO: Implement API call
    throw new Error('Not implemented');
  },

  updateTodo: async (id: string, data: UpdateTodoData): Promise<Todo> => {
    // TODO: Implement API call
    throw new Error('Not implemented');
  },

  deleteTodo: async (id: string): Promise<void> => {
    // TODO: Implement API call
    throw new Error('Not implemented');
  },
};
