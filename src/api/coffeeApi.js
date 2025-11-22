// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Генератор ID для новых напитков
const generateId = () => Date.now().toString();

// Базовый URL API
const API_BASE_URL = 'http://localhost:3001/api';

// Универсальный метод для API запросов
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Основной API
export const coffeeApi = {
  // Получить все напитки
  getDrinks: async () => {
    return apiRequest('/drinks');
  },
  
  // Получить напиток по ID
  getDrinkById: async (id) => {
    return apiRequest(`/drinks/${id}`);
  },
  
  // Добавить новый напиток
  addDrink: async (drinkData) => {
    return apiRequest('/drinks', {
      method: 'POST',
      body: JSON.stringify(drinkData),
    });
  },
  
  // Обновить напиток
  updateDrink: async (id, drinkData) => {
    return apiRequest(`/drinks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(drinkData),
    });
  },
  
  // Удалить напиток
  deleteDrink: async (id) => {
    return apiRequest(`/drinks/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Избранное (работает через localStorage как временное решение)
  getFavorites: async () => {
    await delay(200);
    try {
      const favorites = localStorage.getItem('coffee_favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },
  
  addFavorite: async (favorite) => {
    await delay(200);
    const favorites = await coffeeApi.getFavorites();
    const newFavorite = {
      id: generateId(),
      created_at: new Date().toISOString(),
      created_by: 'user@example.com',
      ...favorite
    };
    
    const updatedFavorites = [...favorites, newFavorite];
    localStorage.setItem('coffee_favorites', JSON.stringify(updatedFavorites));
    return newFavorite;
  },
  
  removeFavorite: async (favoriteId) => {
    await delay(200);
    const favorites = await coffeeApi.getFavorites();
    const updatedFavorites = favorites.filter(f => f.id !== favoriteId);
    localStorage.setItem('coffee_favorites', JSON.stringify(updatedFavorites));
  }
};