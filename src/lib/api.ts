const API_URL = 'http://localhost:3001/api';

export interface Project {
    id: number;
    title: string;
    description: string;
    year: string;
    tags: string[];
    image: string;
    link?: string;
    createdAt?: string;
}

export interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    date: string;
    read: boolean;
}

export const api = {
    // Projects
    getProjects: async (): Promise<Project[]> => {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    createProject: async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project)
        });
        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
    },

    // Messages
    getMessages: async (): Promise<Message[]> => {
        const response = await fetch(`${API_URL}/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        return response.json();
    },

    createMessage: async (data: { name: string; email: string; message: string }): Promise<Message> => {
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    },

    markMessageRead: async (id: number): Promise<Message> => {
        const response = await fetch(`${API_URL}/messages/${id}/read`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error('Failed to update message');
        return response.json();
    },

    deleteMessage: async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/messages/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete message');
    }
};
