import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { 
  ArrowLeft, Heart, Flame, Droplet, Coffee, 
  Sparkles, Clock, Thermometer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { coffeeApi } from '@/api/coffeeApi';


export default function DrinkDetails() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const drinkId = urlParams.get('id');

  // Загрузка напитка
  const { data: drinks = [] } = useQuery({
    queryKey: ['drinks'],
    queryFn: () => coffeeApi.getDrinks(),
  });

  const drink = drinks.find(d => d.id === drinkId);

  // Загрузка избранного
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => coffeeApi.getFavorites(),
  });

  const favorite = favorites.find(f => f.drink_id === drinkId);

  // Добавление/удаление из избранного
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (favorite) {
        await coffeeApi.removeFavorite(favorite.id);
      } else {
        await coffeeApi.addFavorite({
          drink_id: drinkId,
          drink_name: drink.name,
          times_consumed: 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  if (!drink) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Coffee className="w-16 h-16 mx-auto text-neutral-slate mb-4" />
          <h2 className="font-display text-2xl font-bold text-primary-dark mb-2">
            Напиток не найден
          </h2>
          <Link to={createPageUrl('Home')}>
            <Button className="mt-4 bg-primary-dark">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к каталогу
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Навигация назад */}
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-8 hover:bg-primary-gold/10 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к каталогу
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Изображение */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative rounded-3xl overflow-hidden shadow-lg group">
                <img
                  src={drink.image_url}
                  alt={drink.name}
                  className="w-full aspect-[4/5] object-cover"
                />
                
                {/* Кнопка избранного */}
                <Button
                  size="lg"
                  className={`absolute top-6 right-6 w-14 h-14 rounded-2xl backdrop-blur-md transition-all duration-300 z-10 border-2 ${
                    favorite
                      ? 'bg-red-500 border-red-500 hover:bg-red-600'
                      : 'bg-white/90 border-red-300 hover:bg-white'
                  }`}
                  onClick={() => toggleFavoriteMutation.mutate()}
                >
                  {favorite ? (
                    <span className="text-2xl text-white">❤</span>
                  ) : (
                    <span className="text-2xl text-red-500">♡</span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Информация */}
          <div>
            {/* Заголовок */}
            <div className="mb-8">
              {drink.name_en && (
                <p className="font-mono text-sm text-neutral-slate uppercase tracking-wider mb-2">
                  {drink.name_en}
                </p>
              )}
              <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-dark mb-4 leading-tight">
                {drink.name}
              </h1>
              
              {/* Бейджи */}
              <div className="flex flex-wrap gap-2 mb-6">
                {drink.category && (
                  <Badge className="bg-primary-gold/20 text-primary-dark border-primary-gold/30 text-sm px-3 py-1">
                    <Coffee className="w-3.5 h-3.5 mr-1.5" />
                    {drink.category === 'espresso' ? 'Эспрессо' : 
                     drink.category === 'milk_based' ? 'Молочный' :
                     drink.category === 'cold_brew' ? 'Холодный' :
                     drink.category === 'filter' ? 'Фильтр' : 'Специальный'}
                  </Badge>
                )}
                {drink.temperature && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-3 py-1">
                    <Thermometer className="w-3.5 h-3.5 mr-1.5" />
                    {drink.temperature}
                  </Badge>
                )}
                {drink.volume_ml && (
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <Droplet className="w-3.5 h-3.5 mr-1.5" />
                    {drink.volume_ml} мл
                  </Badge>
                )}
              </div>

              <p className="text-lg text-neutral-charcoal leading-relaxed">
                {drink.description}
              </p>
            </div>

            {/* Характеристики */}
            <Card className="mb-8 border-primary-gold/20 shadow-lg">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-primary-dark flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-gold" />
                  Характеристики
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Вкусовой профиль */}
                {(drink.strength || drink.bitterness || drink.acidity || drink.sweetness) && (
                  <div>
                    <h4 className="font-semibold text-primary-dark mb-4">Вкусовой профиль</h4>
                    <div className="space-y-3">
                      {drink.strength && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <Flame className="w-4 h-4 text-accent-bronze" />
                              <span className="text-sm text-neutral-charcoal">Крепость</span>
                            </div>
                            <span className="font-semibold text-primary-dark">{drink.strength}/5</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className="bg-black h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(drink.strength / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {drink.bitterness && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-neutral-charcoal">Горечь</span>
                            <span className="font-semibold text-primary-dark">{drink.bitterness}/5</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(drink.bitterness / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {drink.acidity && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-neutral-charcoal">Кислотность</span>
                            <span className="font-semibold text-primary-dark">{drink.acidity}/5</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(drink.acidity / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {drink.sweetness && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-neutral-charcoal">Сладость</span>
                            <span className="font-semibold text-primary-dark">{drink.sweetness}/5</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(drink.sweetness / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Дополнительная информация */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-gold/20">
                  {drink.caffeine_mg && (
                    <div>
                      <p className="text-xs text-neutral-slate mb-1">Кофеин</p>
                      <p className="font-semibold text-primary-dark">{drink.caffeine_mg} мг</p>
                    </div>
                  )}
                  {drink.brewing_method && (
                    <div>
                      <p className="text-xs text-neutral-slate mb-1">Приготовление</p>
                      <p className="font-semibold text-primary-dark">{drink.brewing_method}</p>
                    </div>
                  )}
                  {drink.origin && (
                    <div>
                      <p className="text-xs text-neutral-slate mb-1">Происхождение</p>
                      <p className="font-semibold text-primary-dark">{drink.origin}</p>
                    </div>
                  )}
                </div>

                {/* Ингредиенты */}
                {drink.ingredients && drink.ingredients.length > 0 && (
                  <div className="pt-4 border-t border-primary-gold/20">
                    <h4 className="font-semibold text-primary-dark mb-3">Ингредиенты</h4>
                    <div className="flex flex-wrap gap-2">
                      {drink.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="border-primary-gold/30">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Настроение и время */}
                {((drink.mood_tags && drink.mood_tags.length > 0) || (drink.time_of_day && drink.time_of_day.length > 0)) && (
                  <div className="pt-4 border-t border-primary-gold/20">
                    {drink.mood_tags && drink.mood_tags.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-primary-dark mb-2 text-sm">Подходит для</h4>
                        <div className="flex flex-wrap gap-2">
                          {drink.mood_tags.map((mood, index) => (
                            <Badge key={index} className="bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30">
                              {mood}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {drink.time_of_day && drink.time_of_day.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-primary-dark mb-2 text-sm flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Время суток
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {drink.time_of_day.map((time, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                              {time}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}