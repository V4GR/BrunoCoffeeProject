import { staticDrinks } from './mockData';

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Генератор ID для новых напитков
const generateId = () => Date.now().toString();

// Определяем среду
const isDevelopment = import.meta.env.DEV; // Vite way
const isProduction = import.meta.env.PROD;

// Базовый URL API
const API_BASE_URL = 'http://localhost:3001/api';

// Универсальный метод для API запросов (только для development)
const apiRequest = async (endpoint, options = {}) => {
  if (!isDevelopment) {
    throw new Error('API доступно только в режиме разработки');
  }
  
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
    await delay(300);
    
    if (isDevelopment) {
      // На localhost - реальный сервер
      return apiRequest('/drinks');
    } else {
      // На Vercel - статические данные
      return staticDrinks;
    }
  },
  
  // Получить напиток по ID
  getDrinkById: async (id) => {
    await delay(200);
    
    if (isDevelopment) {
      return apiRequest(`/drinks/${id}`);
    } else {
      const drink = staticDrinks.find(d => d.id === id);
      if (!drink) throw new Error('Напиток не найден');
      return drink;
    }
  },
  
  // Добавить новый напиток
  addDrink: async (drinkData) => {
    await delay(400);
    
    if (isDevelopment) {
      // На localhost - реальное сохранение
      return apiRequest('/drinks', {
        method: 'POST',
        body: JSON.stringify(drinkData),
      });
    } else {
      // На Vercel - эмуляция (данные не сохраняются)
      const newDrink = {
        id: generateId(),
        created_at: new Date().toISOString(),
        created_by: 'admin',
        ...drinkData
      };
      console.log('На Vercel добавление напитка эмулировано');
      return newDrink;
    }
  },
  
  // Обновить напиток
  updateDrink: async (id, drinkData) => {
    await delay(400);
    
    if (isDevelopment) {
      return apiRequest(`/drinks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(drinkData),
      });
    } else {
      // На Vercel - эмуляция
      console.log('На Vercel обновление напитка эмулировано');
      return { ...drinkData, id, updated_at: new Date().toISOString() };
    }
  },
  
  // Удалить напиток
  deleteDrink: async (id) => {
    await delay(300);
    
    if (isDevelopment) {
      return apiRequest(`/drinks/${id}`, {
        method: 'DELETE',
      });
    } else {
      // На Vercel - эмуляция
      console.log('На Vercel удаление напитка эмулировано');
      return { id, deleted: true };
    }
  },
  
  // Избранное (всегда через localStorage)
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