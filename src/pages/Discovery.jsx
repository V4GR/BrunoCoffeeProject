import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Compass, Sparkles, Sun, Moon, Heart, Zap, Brain, Home as HomeIcon, Coffee, ArrowRight, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { coffeeApi } from '@/api/coffeeApi';

export default function Discovery() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    mood: null,
    timeOfDay: null,
    preference: null
  });
  const [recommendations, setRecommendations] = useState([]);

  // Загрузка напитков
  const { data: drinks = [] } = useQuery({
    queryKey: ['drinks'],
    queryFn: () => coffeeApi.getDrinks(),
  });

  const moods = [
    { value: 'бодрость', label: 'Бодрость', icon: Zap, color: 'from-yellow-400 to-orange-500', description: 'Нужен заряд энергии' },
    { value: 'расслабление', label: 'Расслабление', icon: Heart, color: 'from-pink-400 to-purple-500', description: 'Хочу расслабиться' },
    { value: 'творчество', label: 'Творчество', icon: Sparkles, color: 'from-blue-400 to-cyan-500', description: 'Готов к креативу' },
    { value: 'концентрация', label: 'Концентрация', icon: Brain, color: 'from-indigo-400 to-purple-500', description: 'Нужно сосредоточиться' },
    { value: 'уют', label: 'Уют', icon: HomeIcon, color: 'from-amber-400 to-red-500', description: 'Хочу уюта' },
    { value: 'романтика', label: 'Романтика', icon: Heart, color: 'from-rose-400 to-pink-500', description: 'Романтичное настроение' }
  ];

  const timesOfDay = [
    { value: 'утро', label: 'Утро', icon: Sun, emoji: '☀️', description: '6:00 - 12:00' },
    { value: 'день', label: 'День', icon: Sun, emoji: '🌤️', description: '12:00 - 18:00' },
    { value: 'вечер', label: 'Вечер', icon: Moon, emoji: '🌅', description: '18:00 - 22:00' },
    { value: 'ночь', label: 'Ночь', icon: Moon, emoji: '🌙', description: '22:00 - 6:00' }
  ];

  const preferences = [
    { value: 'strong', label: 'Крепкий', description: 'Насыщенный вкус кофе' },
    { value: 'mild', label: 'Мягкий', description: 'Деликатный и легкий' },
    { value: 'sweet', label: 'Сладкий', description: 'С приятной сладостью' },
    { value: 'cold', label: 'Холодный', description: 'Освежающий напиток' }
  ];

  const handleSelection = (category, value) => {
    setSelections(prev => ({ ...prev, [category]: value }));
    if (step < 2) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      // Генерация рекомендаций
      generateRecommendations(value);
    }
  };

  const generateRecommendations = (preference) => {
    const { mood, timeOfDay } = selections;
    
    let filtered = drinks.filter(drink => {
      let score = 0;

      // Проверка настроения
      if (mood && drink.mood_tags?.includes(mood)) score += 3;

      // Проверка времени суток
      if (timeOfDay && drink.time_of_day?.includes(timeOfDay)) score += 2;

      // Проверка предпочтений
      if (preference === 'strong' && drink.strength >= 4) score += 2;
      if (preference === 'mild' && drink.strength <= 2) score += 2;
      if (preference === 'sweet' && drink.sweetness >= 4) score += 2;
      if (preference === 'cold' && drink.temperature === 'холодный') score += 3;

      return score > 0;
    });

    // Сортировка по релевантности и выбор топ-3
    filtered.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      
      if (mood && a.mood_tags?.includes(mood)) scoreA += 3;
      if (mood && b.mood_tags?.includes(mood)) scoreB += 3;
      if (timeOfDay && a.time_of_day?.includes(timeOfDay)) scoreA += 2;
      if (timeOfDay && b.time_of_day?.includes(timeOfDay)) scoreB += 2;
      if (preference === 'strong') {
        if (a.strength >= 4) scoreA += 2;
        if (b.strength >= 4) scoreB += 2;
      }
      if (preference === 'mild') {
        if (a.strength <= 2) scoreA += 2;
        if (b.strength <= 2) scoreB += 2;
      }
      if (preference === 'sweet') {
        if (a.sweetness >= 4) scoreA += 2;
        if (b.sweetness >= 4) scoreB += 2;
      }
      if (preference === 'cold') {
        if (a.temperature === 'холодный') scoreA += 3;
        if (b.temperature === 'холодный') scoreB += 3;
      }
      
      return scoreB - scoreA;
    });

    setRecommendations(filtered.slice(0, 3));
    setStep(3);
  };

  const reset = () => {
    setStep(0);
    setSelections({ mood: null, timeOfDay: null, preference: null });
    setRecommendations([]);
  };

  const getRandomRecommendation = () => {
    const randomDrinks = [...drinks].sort(() => 0.5 - Math.random()).slice(0, 3);
    setRecommendations(randomDrinks);
    setStep(3);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/10 border border-primary-gold/30 mb-4">
            <Compass className="w-4 h-4 text-primary-gold" />
            <span className="font-mono text-xs text-primary-dark uppercase tracking-wider">
              Умный подбор
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-dark mb-4">
            Найди свой идеальный кофе
          </h1>
          
          <p className="text-lg text-neutral-charcoal max-w-2xl mx-auto mb-8">
            Ответьте на несколько вопросов, и мы подберем напиток специально для вас
          </p>

          {/* Прогресс */}
          {step < 3 && (
            <div className="flex justify-center gap-2 mb-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === step ? 'w-12 bg-primary-gold' : i < step ? 'w-8 bg-primary-gold/50' : 'w-8 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Шаг 1: Настроение */}
        {step === 0 && (
          <div className="animate-fadeInUp">
            <h2 className="font-display text-3xl font-bold text-primary-dark text-center mb-8">
              Какое у вас настроение?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moods.map((mood) => {
                const Icon = mood.icon;
                return (
                  <Card
                    key={mood.value}
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-primary-gold/50 overflow-hidden group"
                    onClick={() => handleSelection('mood', mood.value)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${mood.color}`} />
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${mood.color} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-primary-dark mb-2">
                        {mood.label}
                      </h3>
                      <p className="text-sm text-neutral-slate">
                        {mood.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Шаг 2: Время суток */}
        {step === 1 && (
          <div className="animate-fadeInUp">
            <h2 className="font-display text-3xl font-bold text-primary-dark text-center mb-8">
              Когда будете пить кофе?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timesOfDay.map((time) => (
                <Card
                  key={time.value}
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-primary-gold/50 group"
                  onClick={() => handleSelection('timeOfDay', time.value)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {time.emoji}
                    </div>
                    <h3 className="font-display text-xl font-bold text-primary-dark mb-1">
                      {time.label}
                    </h3>
                    <p className="text-sm text-neutral-slate">
                      {time.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Шаг 3: Предпочтения */}
        {step === 2 && (
          <div className="animate-fadeInUp">
            <h2 className="font-display text-3xl font-bold text-primary-dark text-center mb-8">
              Какой кофе предпочитаете?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {preferences.map((pref) => (
                <Card
                  key={pref.value}
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-primary-gold/50 group"
                  onClick={() => handleSelection('preference', pref.value)}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-gold/20 flex items-center justify-center group-hover:bg-primary-gold/30 transition-colors">
                        <Coffee className="w-6 h-6 text-primary-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-primary-dark mb-1">
                          {pref.label}
                        </h3>
                        <p className="text-sm text-neutral-slate">
                          {pref.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Результаты */}
        {step === 3 && (
          <div className="animate-fadeInUp">
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-gold to-accent-bronze flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display text-4xl font-bold text-primary-dark mb-4">
                Ваши рекомендации
              </h2>
              <p className="text-neutral-charcoal mb-6">
                Мы подобрали {recommendations.length} {recommendations.length === 1 ? 'напиток' : 'напитка'} специально для вас
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={reset}
                  className="rounded-xl bg-white hover:bg-gray-50 text-primary-dark border-2 border-primary-dark"
                >
                  <ArrowRight className="w-4 h-4 mr-2 text-primary-dark rotate-180" />
                  Начать заново
                </Button>
                <Button
                  onClick={getRandomRecommendation}
                  className="rounded-xl bg-white hover:bg-gray-50 text-primary-dark border-2 border-primary-dark"
                >
                  <Shuffle className="w-4 h-4 mr-2 text-primary-dark" />
                  Случайный выбор
                </Button>
              </div>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.map((drink, index) => (
                  <Link
                    key={drink.id}
                    to={createPageUrl('DrinkDetails') + `?id=${drink.id}`}
                    className="block"
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-gold/20 hover:border-primary-gold/50 group h-full">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={drink.image_url}
                          alt={drink.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <Badge className="absolute top-4 left-4 bg-white text-primary-dark border-2 border-primary-dark font-bold shadow-lg">
                          #{index + 1} выбор
                        </Badge>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-display text-2xl font-bold text-primary-dark mb-2 group-hover:text-primary-gold transition-colors">
                          {drink.name}
                        </h3>
                        {drink.name_en && (
                          <p className="font-mono text-xs text-neutral-slate uppercase mb-3">
                            {drink.name_en}
                          </p>
                        )}
                        <p className="text-sm text-neutral-charcoal line-clamp-3">
                          {drink.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-primary-gold/20">
                <Coffee className="w-16 h-16 mx-auto mb-4 text-neutral-slate" />
                <p className="text-neutral-charcoal">
                  К сожалению, мы не нашли подходящих напитков. Попробуйте изменить параметры.
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Быстрый случайный выбор */}
        {step === 0 && (
          <div className="mt-16 text-center">
            <p className="text-neutral-slate mb-4">или</p>
            <Button
              onClick={getRandomRecommendation}
              variant="outline"
              size="lg"
              className="rounded-2xl border-primary-gold/30 hover:bg-primary-gold/10 text-primary-dark"
            >
              <Shuffle className="w-5 h-5 mr-2 text-primary-dark" />
              Удивите меня!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}