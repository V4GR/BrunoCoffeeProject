import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';
import DrinkCard from '../components/coffee/DrinkCard';
import FilterPanel from '../components/coffee/FilterPanel';
import { coffeeApi } from '@/api/coffeeApi';

export default function Home() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    mood: null,
    timeOfDay: null,
    minStrength: 1,
    maxStrength: 5
  });

  // Загрузка напитков
  const { data: drinks = [], isLoading: drinksLoading } = useQuery({
    queryKey: ['drinks'],
    queryFn: () => coffeeApi.getDrinks(),
  });

  // Загрузка избранного
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => coffeeApi.getFavorites(),
  });

  // Добавление/удаление из избранного
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (drink) => {
      const existing = favorites.find(f => f.drink_id === drink.id);
      
      if (existing) {
        await coffeeApi.removeFavorite(existing.id);
      } else {
        await coffeeApi.addFavorite({
          drink_id: drink.id,
          drink_name: drink.name,
          times_consumed: 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Фильтрация напитков
  const filteredDrinks = drinks.filter(drink => {
    // Поиск
    if (filters.search && !drink.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !drink.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Категория
    if (filters.category !== 'all' && drink.category !== filters.category) {
      return false;
    }

    // Настроение
    if (filters.mood && (!drink.mood_tags || !drink.mood_tags.includes(filters.mood))) {
      return false;
    }

    // Время суток
    if (filters.timeOfDay && (!drink.time_of_day || !drink.time_of_day.includes(filters.timeOfDay))) {
      return false;
    }

    // Крепость
    if (drink.strength) {
      if (drink.strength < filters.minStrength || drink.strength > filters.maxStrength) {
        return false;
      }
    }

    return true;
  });

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      mood: null,
      timeOfDay: null,
      minStrength: 1,
      maxStrength: 5
    });
  };

  const isFavorite = (drinkId) => favorites.some(f => f.drink_id === drinkId);

  return (
    <div className="pb-0">
      {/* Герой секция */}
      <div className="relative overflow-hidden py-4">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-bronze/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Заголовок */}
          <div className="text-center max-w-5xl mx-auto mb-16 animate-fadeInUp">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary-gold/20 to-accent-bronze/20 border-2 border-primary-gold/40 mb-8 shadow-lg">
              <Sparkles className="w-5 h-5 text-primary-gold" />
              <span className="font-mono text-sm font-bold text-primary-dark uppercase tracking-wider">
                Premium Coffee Experience
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute -top-12 -left-8 opacity-20 text-6xl">☕</div>
              <div className="absolute -top-16 right-12 opacity-15 text-5xl rotate-12">🫘</div>
              <div className="absolute -bottom-8 -right-4 opacity-20 text-7xl">🫘</div>
              <div className="absolute bottom-4 left-24 opacity-10 text-4xl -rotate-12">☕</div>
              
              {/* ИСПРАВЛЕННЫЙ ЗАГОЛОВОК */}
              <h1 className="font-display text-4xl md:text-8xl lg:text-8xl font-bold text-primary-dark mb-8 leading-[1.1] relative z-10">
                Ваш идеальный кофе
                <span className="block bg-gradient-to-r from-primary-gold to-accent-bronze bg-clip-text text-transparent mt-4">
                  всегда рядом
                </span>
              </h1>
            </div>
            
            <p className="text-base md:text-2xl text-primary-dark font-medium leading-relaxed max-w-3xl mx-auto mb-12">
              Откройте для себя мир премиального кофе. Умный подбор напитков и персональные рекомендации.
            </p>

            {/* ИСПРАВЛЕННАЯ СТАТИСТИКА */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-primary-gold/20 hover:border-primary-dark transition-all duration-300 hover:scale-105">
                <div className="font-display text-4xl font-bold text-primary-dark mb-2">
                  {drinks.length}+
                </div>
                <div className="text-sm font-semibold text-primary-dark">Напитков</div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-primary-gold/20 hover:border-primary-dark transition-all duration-300 hover:scale-105">
                <div className="font-display text-4xl font-bold text-primary-dark mb-2">
                  12
                </div>
                <div className="text-sm font-semibold text-primary-dark text-center">Критериев выбора</div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-primary-gold/20 hover:border-primary-dark transition-all duration-300 hover:scale-105">
                <div className="font-display text-4xl font-bold text-primary-dark mb-2">
                  10
                </div>
                <div className="text-sm font-semibold text-primary-dark">Бариста советуют</div>
              </div>
            </div>
          </div>

          {/* Фильтры */}
          <div className="mb-12">
            <FilterPanel 
              filters={filters} 
              onFilterChange={setFilters}
              onReset={resetFilters}
            />
          </div>

          {/* Результаты поиска */}
          {filters.search && (
            <div className="mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary-gold" />
              <p className="text-primary-dark opacity-80">
                Найдено: <span className="font-semibold text-primary-dark">{filteredDrinks.length}</span> {filteredDrinks.length === 1 ? 'напиток' : 'напитков'}
              </p>
            </div>
          )}

          {/* Сетка напитков */}
          {drinksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse shadow-lg" />
              ))}
            </div>
          ) : filteredDrinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDrinks.map((drink, index) => (
                <div 
                  key={drink.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <DrinkCard
                    drink={drink}
                    isFavorite={isFavorite(drink.id)}
                    onToggleFavorite={toggleFavoriteMutation.mutate}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-gold/10 flex items-center justify-center">
                <Zap className="w-12 h-12 text-primary-gold" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary-dark mb-3">
                Ничего не найдено
              </h3>
              <p className="text-primary-dark opacity-70 mb-6">
                Попробуйте изменить параметры поиска
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-primary-dark text-white rounded-xl hover:bg-neutral-charcoal transition-colors duration-300"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}