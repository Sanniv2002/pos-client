  const API_BASE_URL = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000'
    : 'http://127.0.0.1:8000';
  
  export interface SessionResponse {
    message: string;
    session_id: string;
    session_details: {
      task_queue_name: string;
      results_set_name: string;
      exclusion_list: string;
      created_at: number;
      ttl: number;
    };
  }
  
  export interface TaskData {
    language: string;
    pos: string;
    model: string;
    count: number;
  }
  
  export interface TaskRequest {
    session_id: string;
    task_data: TaskData;
  }
  
  export interface ResultItem {
    'Word (Hindi)': string;
    'Word (English)': string;
    'Sentence (Hindi)': string;
    'Sentence (English)': string;
  }
  
  export interface ResultsResponse {
    session_id: string;
    result: string[];
    count: number;
  }
  
  export interface Task {
    task_id: string;
    language: string;
    pos: string;
    model: string;
    count: number;
    created_at: number;
    status: string;
  }
  
  export interface TasksResponse {
    session_id: string;
    tasks: Task[];
  }
  
  export const api = {
    createSession: async (): Promise<SessionResponse> => {
      const response = await fetch(`${API_BASE_URL}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      return response.json();
    },
  
    submitTask: async (taskData: TaskRequest): Promise<any> => {
      const response = await fetch(`${API_BASE_URL}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit task');
      }
      
      return response.json();
    },
  
    getTasks: async (sessionId: string): Promise<TasksResponse> => {
      const response = await fetch(`${API_BASE_URL}/tasks/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      return response.json();
    },
  
    getResults: async (sessionId: string, taskId: string): Promise<ResultsResponse> => {
      const url = `${API_BASE_URL}/result?session_id=${encodeURIComponent(sessionId)}&task_id=${encodeURIComponent(taskId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.error('API response not ok:', response.status, response.statusText);
        throw new Error('Failed to fetch results');
      }
      
      const data = await response.json();
      
      return {
        ...data
      };
    },
  };