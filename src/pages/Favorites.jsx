import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Trash2, Star, TrendingDown, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { coffeeApi } from '@/api/coffeeApi';

export default function Favorites() {
  const queryClient = useQueryClient();

  // Загрузка избранного
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => coffeeApi.getFavorites(),
  });

  // Загрузка всех напитков
  const { data: drinks = [] } = useQuery({
    queryKey: ['drinks'],
    queryFn: () => coffeeApi.getDrinks(),
  });

  // Удаление из избранного
  const removeFavoriteMutation = useMutation({
    mutationFn: (favoriteId) => coffeeApi.removeFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Обновление рейтинга
  const updateRatingMutation = useMutation({
    mutationFn: ({ favoriteId, rating }) => 
      coffeeApi.updateFavorite(favoriteId, { rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  // Получение полных данных о напитках
  const favoriteDrinks = favorites
    .map(fav => ({
      ...drinks.find(d => d.id === fav.drink_id),
      favorite: fav
    }))
    .filter(item => item.id); // Фильтруем только существующие напитки

  const totalFavorites = favoriteDrinks.length;
  const averageRating = totalFavorites > 0
    ? favoriteDrinks.reduce((sum, item) => sum + (item.favorite.rating || 0), 0) / totalFavorites
    : 0;

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 mb-4">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="font-mono text-xs text-red-800 uppercase tracking-wider">
              Ваша коллекция
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-dark mb-4">
            Избранное
          </h1>
          
          <p className="text-lg text-neutral-charcoal max-w-2xl mx-auto">
            Ваши любимые напитки в одном месте с возможностью оценивать каждый.
          </p>

          {/* Статистика */}
          {totalFavorites > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <Card className="border-primary-gold/20">
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-red-500 fill-current" />
                  <div className="font-display text-3xl font-bold text-primary-dark">
                    {totalFavorites}
                  </div>
                  <div className="text-sm text-neutral-slate">В избранном</div>
                </CardContent>
              </Card>
              
              <Card className="border-primary-gold/20">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-primary-gold fill-current" />
                  <div className="font-display text-3xl font-bold text-primary-dark">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="text-sm text-neutral-slate">Средняя оценка</div>
                </CardContent>
              </Card>

              <Card className="border-primary-gold/20 hidden md:block">
                <CardContent className="p-4 text-center">
                  <Coffee className="w-8 h-8 mx-auto mb-2 text-accent-bronze" />
                  <div className="font-display text-3xl font-bold text-primary-dark">
                    {favoriteDrinks.reduce((sum, item) => sum + (item.favorite.times_consumed || 1), 0)}
                  </div>
                  <div className="text-sm text-neutral-slate">Попробовано раз</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Список избранного */}
        {favoritesLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-64 animate-pulse shadow-lg" />
            ))}
          </div>
        ) : totalFavorites > 0 ? (
          <div className="space-y-6">
            {favoriteDrinks.map((item, index) => (
              <Card 
                key={item.favorite.id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-gold/20 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {/* Изображение и основная информация */}
                    <div className="flex gap-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-24 h-24 rounded-2xl object-cover shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-primary-dark mb-1">
                          {item.name}
                        </h3>
                        {item.name_en && (
                          <p className="font-mono text-xs text-neutral-slate uppercase mb-2">
                            {item.name_en}
                          </p>
                        )}
                        <p className="text-sm text-neutral-charcoal line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Рейтинг и заметки */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-slate mb-2 block">
                          Ваша оценка
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => updateRatingMutation.mutate({
                                favoriteId: item.favorite.id,
                                rating: star
                              })}
                              className="transition-all duration-200 hover:scale-110"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= (item.favorite.rating || 0)
                                    ? 'text-primary-gold fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-sm text-neutral-slate">
                          Попробовано: <span className="font-semibold text-primary-dark">
                            {item.favorite.times_consumed || 1} раз
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl"
                        onClick={() => removeFavoriteMutation.mutate(item.favorite.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить из избранного
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-primary-dark mb-3">
              Пока нет избранных напитков
            </h3>
            <p className="text-neutral-slate mb-6 max-w-md mx-auto">
              Добавляйте понравившиеся напитки в избранное, чтобы не потерять их
            </p>
            <a href="/">
              <Button className="bg-primary-dark hover:bg-neutral-charcoal text-white rounded-xl px-8">
                <Heart className="w-4 h-4 mr-2" />
                Перейти к каталогу
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}