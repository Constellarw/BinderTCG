import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('📤 Interceptor: Enviando requisição para:', config.url);
  console.log('📤 Interceptor: Token encontrado:', token ? 'SIM' : 'NÃO');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('📤 Interceptor: Header Authorization adicionado');
  } else {
    console.log('📤 Interceptor: NENHUM token para adicionar');
  }
  
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚨 Interceptor: Token inválido/expirado:', error.response.data);
      // Comentado temporariamente para debug
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login with Google
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  // Handle authentication success (called after Google redirect)
  handleAuthSuccess: (token) => {
    console.log('🔑 authService: Salvando token...', { 
      tokenLength: token ? token.length : 'Nulo',
      tokenStart: token ? token.substring(0, 20) + '...' : 'Nulo'
    });
    localStorage.setItem('token', token);
    console.log('🔑 authService: Token salvo no localStorage');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export const deckService = {
  // Get all decks
  getDecks: async () => {
    try {
      const response = await api.get('/api/decks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get specific deck
  getDeck: async (deckId) => {
    try {
      const response = await api.get(`/api/decks/${deckId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new deck
  createDeck: async (name) => {
    try {
      const response = await api.post('/api/decks', { name });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update deck
  updateDeck: async (deckId, updates) => {
    try {
      const response = await api.put(`/api/decks/${deckId}`, updates);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete deck
  deleteDeck: async (deckId) => {
    try {
      await api.delete(`/api/decks/${deckId}`);
    } catch (error) {
      throw error;
    }
  },

  // Add card to deck
  addCardToDeck: async (deckId, card, quantity = 1) => {
    try {
      const response = await api.post(`/api/decks/${deckId}/cards`, { card, quantity });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove card from deck
  removeCardFromDeck: async (deckId, cardId) => {
    try {
      const response = await api.delete(`/api/decks/${deckId}/cards/${cardId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const galleryService = {
  // Get gallery
  getGallery: async () => {
    try {
      const response = await api.get('/api/gallery');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add card to gallery
  addCardToGallery: async (card, notes = '') => {
    try {
      const response = await api.post('/api/gallery/cards', { card, notes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove card from gallery
  removeCardFromGallery: async (cardId) => {
    try {
      const response = await api.delete(`/api/gallery/cards/${cardId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update card notes
  updateCardNotes: async (cardId, notes) => {
    try {
      const response = await api.put(`/api/gallery/cards/${cardId}`, { notes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Share gallery
  shareGallery: async () => {
    try {
      const response = await api.post('/api/gallery/share');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get shared gallery by token
  getSharedGallery: async (token) => {
    try {
      const response = await api.get(`/api/gallery/shared/${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Toggle gallery public/private
  toggleGalleryVisibility: async () => {
    try {
      const response = await api.put('/api/gallery/toggle-public');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
