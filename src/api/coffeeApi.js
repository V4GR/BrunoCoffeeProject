import { mockDrinks, getFavorites, setFavorites, saveFavorites } from './mockData';

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const coffeeApi = {
  // Получить все напитки
  getDrinks: async () => {
    await delay(300);
    return mockDrinks;
  },
  
  // Получить избранное
  getFavorites: async () => {
    await delay(200);
    return getFavorites();
  },
  
  // Добавить в избранное
  addFavorite: async (favorite) => {
    await delay(200);
    const favorites = getFavorites();
    const newFavorite = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      created_by: 'user@example.com',
      ...favorite
    };
    
    setFavorites([...favorites, newFavorite]);
    return newFavorite;
  },
  
  // Удалить из избранного
  removeFavorite: async (favoriteId) => {
    await delay(200);
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(f => f.id !== favoriteId);
    setFavorites(updatedFavorites);
  },
  
  // Обновить избранное
  updateFavorite: async (favoriteId, updates) => {
    await delay(200);
    const favorites = getFavorites();
    const favoriteIndex = favorites.findIndex(f => f.id === favoriteId);
    
    if (favoriteIndex !== -1) {
      favorites[favoriteIndex] = { ...favorites[favoriteIndex], ...updates };
      setFavorites(favorites);
      return favorites[favoriteIndex];
    }
    
    return null;
  }
};