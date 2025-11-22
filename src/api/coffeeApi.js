import { mockDrinks, getFavorites, setFavorites, saveFavorites } from './mockData';

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Генератор ID для новых напитков
const generateId = () => Date.now().toString();

export const coffeeApi = {
  // Получить все напитки
  getDrinks: async () => {
    await delay(300);
    return mockDrinks;
  },
  
  // Получить напиток по ID
  getDrinkById: async (id) => {
    await delay(200);
    const drink = mockDrinks.find(d => d.id === id);
    if (!drink) throw new Error('Напиток не найден');
    return drink;
  },
  
  // Добавить новый напиток
  addDrink: async (drinkData) => {
    await delay(400);
    const newDrink = {
      id: generateId(),
      created_at: new Date().toISOString(),
      created_by: 'admin',
      ...drinkData
    };
    
    mockDrinks.push(newDrink);
    // Здесь можно добавить сохранение в localStorage если нужно
    return newDrink;
  },
  
  // Обновить напиток
  updateDrink: async (id, drinkData) => {
    await delay(400);
    const drinkIndex = mockDrinks.findIndex(d => d.id === id);
    
    if (drinkIndex === -1) {
      throw new Error('Напиток не найден');
    }
    
    mockDrinks[drinkIndex] = {
      ...mockDrinks[drinkIndex],
      ...drinkData,
      updated_at: new Date().toISOString()
    };
    
    return mockDrinks[drinkIndex];
  },
  
  // Удалить напиток
  deleteDrink: async (id) => {
    await delay(300);
    const drinkIndex = mockDrinks.findIndex(d => d.id === id);
    
    if (drinkIndex === -1) {
      throw new Error('Напиток не найден');
    }
    
    const deletedDrink = mockDrinks[drinkIndex];
    mockDrinks.splice(drinkIndex, 1);
    
    return deletedDrink;
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
      id: generateId(),
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