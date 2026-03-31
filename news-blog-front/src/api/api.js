const API_BASE_URL = '';

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(API_BASE_URL + url, {
      ...options,
      headers,
    });

    if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const text = await response.text();
        if (!text || text.trim() === '') {
          return null;
        }

        return JSON.parse(text);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const authAPI = {
  login: async (credentials) => {
    console.log('Sending login request:', credentials);
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    console.log('Login response:', response);
    return response;
  },

  register: async (userData) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }
};

export const articlesAPI = {
  getAll: async () => {
    return fetchWithAuth('/api/articles');
  },

  getById: async (id) => {
    return fetchWithAuth(`/api/articles/${id}`);
  },

  getMyArticles: async () => {
    const allArticles = await fetchWithAuth('/api/articles');
    const username = localStorage.getItem('username');
    return allArticles.filter(article => article.author === username);
  },

  create: async (articleData) => {
    return fetchWithAuth('/api/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },

  update: async (id, articleData) => {
    return fetchWithAuth(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  },

  delete: async (id) => {
    return fetchWithAuth(`/api/articles/${id}`, {
      method: 'DELETE',
    });
  },

  like: async (id) => {
    return fetchWithAuth(`/api/articles/toggle-like/${id}`, {
      method: 'POST',
    });
  },
};

export const categoriesAPI = {
  getAll: async () => {
    return fetchWithAuth('/api/categories');
  },

  create: async (name) => {
    return fetchWithAuth(`/api/admin/categories?name=${encodeURIComponent(name)}`, {
      method: 'POST',
    });
  },
};

export const usersAPI = {
  getAll: async () => {
    return fetchWithAuth('/api/users');
  },

  makeAdmin: async (userId) => {
    return fetchWithAuth(`/api/admin/users/${userId}/make-admin`, {
      method: 'POST',
    });
  },

  getStats: async () => {
    return fetchWithAuth('/api/admin/stats');
  },
};