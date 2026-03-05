const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export const api = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: getHeaders(),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `API Error: ${response.statusText}`);
        }
        return response.json();
    },

    post: async (endpoint: string, data: any) => {
        console.log(`Fetching: ${API_URL}${endpoint}`);
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `API Error: ${response.statusText}`);
        }
        return response.json();
    },

    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `API Error: ${response.statusText}`);
        }
        return response.json();
    },

    delete: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `API Error: ${response.statusText}`);
        }
        return response.json();
    },

    patch: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `API Error: ${response.statusText}`);
        }
        return response.json();
    },

    // Auth endpoints
    auth: {
        login: (data: any) => api.post('/auth/login', data),
        verifyOTP: (data: any) => api.post('/auth/verify-otp', data),
        forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
        resetPassword: (data: any) => api.post('/auth/reset-password', data),
        register: (data: any) => api.post('/auth/register', data), // For demo
    },

    // Grandparents endpoints
    grandparents: {
        getAll: () => api.get('/grandparents'),
        getById: (id: string) => api.get(`/grandparents/${id}`),
        create: (data: any) => api.post('/grandparents', data),
        update: (id: string, data: any) => api.put(`/grandparents/${id}`, data),
        delete: (id: string) => api.delete(`/grandparents/${id}`),
        getStats: (timeRange: string) => api.get(`/grandparents/stats?timeRange=${timeRange}`),
        getMembers: (familyId?: string) => api.get(`/grandparents/members${familyId ? `?familyId=${familyId}` : ''}`),
        getCommittee: () => api.get('/grandparents/members?is_committee=true'),
        createMember: (data: any) => api.post('/grandparents/members', data),
        updateMember: (id: string, data: any) => api.put(`/grandparents/members/${id}`, data),
        deleteMember: (id: string) => api.delete(`/grandparents/members/${id}`),
    },

    // Notes
    notes: {
        getAll: (portal?: string) => api.get(`/notes${portal ? `?portal=${portal}` : ''}`),
        create: (data: any) => api.post('/notes', data),
        update: (id: string, data: any) => api.put(`/notes/${id}`, data),
        delete: (id: string) => api.delete(`/notes/${id}`),
    },

    // Schedules
    schedules: {
        getAll: (portal?: string) => api.get(`/schedules${portal ? `?portal=${portal}` : ''}`),
        create: (data: any) => api.post('/schedules', data),
        delete: (id: string) => api.delete(`/schedules/${id}`),
    },

    // Assignments
    assignments: {
        getAll: (portal?: string) => api.get(`/assignments${portal ? `?portal=${portal}` : ''}`),
        create: (data: any) => api.post('/assignments', data),
        updateStatus: (id: string, status: string) => api.patch(`/assignments/${id}/status`, { status }),
        delete: (id: string) => api.delete(`/assignments/${id}`),
    },

    // Messages
    messages: {
        getRecipients: (portal?: string, department?: string) =>
            api.get(`/messages/recipients?${portal ? `portal=${portal}` : ''}${department ? `&department=${department}` : ''}`),
        send: (data: any) => api.post('/messages/send', data),
        getAll: (params: { portal?: string; status?: string; email?: string }) => {
            const query = new URLSearchParams(params as any).toString();
            return api.get(`/messages?${query}`);
        },
        saveDraft: (data: any) => api.post('/messages/draft', data),
    }
};
