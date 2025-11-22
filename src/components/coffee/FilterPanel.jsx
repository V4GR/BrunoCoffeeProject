import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from '@/components/ui/slider';

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const categories = [
    { value: 'all', label: 'Все категории', icon: '☕' },
    { value: 'espresso', label: 'Эспрессо', icon: '⚫' },
    { value: 'milk_based', label: 'Молочные', icon: '🥛' },
    { value: 'cold_brew', label: 'Холодные', icon: '🧊' },
    { value: 'filter', label: 'Фильтр кофе', icon: '⏳' },
    { value: 'specialty', label: 'Специальные', icon: '✨' }
  ];

  const moods = [
    'бодрость', 'расслабление', 'творчество', 'концентрация', 'уют'
  ];

  const timesOfDay = [
    { value: 'утро', label: '☀️ Утро' },
    { value: 'день', label: '🌤️ День' },
    { value: 'вечер', label: '🌅 Вечер' },
    { value: 'ночь', label: '🌙 Ночь' }
  ];

  const getCurrentCategory = () => {
    return categories.find(cat => cat.value === (filters.category || 'all')) || categories[0];
  };

  const hasActiveFilters = filters.category !== 'all' || 
    filters.mood || 
    filters.timeOfDay || 
    filters.minStrength > 1 ||
    filters.maxStrength < 5;

  // Закрытие выпадающего списка при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySelect = (category) => {
    onFilterChange({ ...filters, category: category.value });
    setIsCategoryOpen(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl border-2 border-coffee-brown/40 p-6 relative z-30">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Поиск с кофейной обводкой */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-coffee-brown/60" />
          <Input
            type="text"
            placeholder="Найти напиток..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-12 h-14 rounded-[1.5rem] border-2 border-coffee-brown/40 focus:border-coffee-brown bg-cream/50 text-coffee-dark placeholder-coffee-brown/50 shadow-inner transition-all duration-300 text-base"
          />
        </div>

        {/* Категория - Кастомный выпадающий список */}
        <div className="relative w-full lg:w-52" ref={categoryRef}>
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full h-14 rounded-[1.5rem] border-2 border-coffee-brown/40 bg-amber-50/50 hover:bg-amber-50 hover:border-coffee-brown/60 shadow-inner transition-all duration-300 flex items-center gap-3 px-4 text-left"
          >
            <span className="text-xl">{getCurrentCategory().icon}</span>
            <span className="text-coffee-dark font-medium flex-1">{getCurrentCategory().label}</span>
            <ChevronDown className={`w-4 h-4 text-coffee-brown/60 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Выпадающий список с кофейной обводкой и высоким z-index */}
          {isCategoryOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-[9999] rounded-[1.5rem] border-2 border-coffee-brown/40 bg-amber-50/90 backdrop-blur-md shadow-2xl overflow-hidden">
              {categories.map((category, index) => (
                <button
                  key={category.value}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full flex items-center gap-3 py-4 px-4 transition-all duration-200 cursor-pointer border-coffee-brown/20 hover:bg-coffee-brown/10
                    ${index === 0 ? 'rounded-t-[1.4rem]' : ''}
                    ${index === categories.length - 1 ? 'rounded-b-[1.4rem]' : 'border-b'}
                    ${filters.category === category.value ? 'bg-coffee-brown/20' : ''}
                  `}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium text-coffee-dark">{category.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Расширенные фильтры */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="h-14 rounded-[1.5rem] border-2 border-coffee-brown/40 bg-cream/50 hover:bg-cream hover:border-coffee-brown/60 shadow-inner transition-all duration-300 relative"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              <span className="text-coffee-dark font-medium">Фильтры</span>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-coffee-accent rounded-full ring-2 ring-cream" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-cream/95 backdrop-blur-sm border-2 border-coffee-brown/40 rounded-l-[2rem]">
            <SheetHeader className="text-left">
              <SheetTitle className="font-display text-2xl text-coffee-dark bg-gradient-to-r from-coffee-dark to-coffee-brown bg-clip-text text-transparent">
                Продвинутые фильтры
              </SheetTitle>
              <SheetDescription className="text-coffee-brown/70 text-base">
                Найдите идеальный напиток под ваше настроение
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 space-y-8">
              {/* Настроение */}
              <div>
                <label className="font-semibold text-coffee-dark mb-4 block text-lg">
                  Настроение
                </label>
                <div className="flex flex-wrap gap-3">
                  {moods.map((mood) => (
                    <Badge
                      key={mood}
                      variant={filters.mood === mood ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all duration-300 text-sm px-4 py-2 rounded-2xl border-2 border-coffee-brown/40 ${
                        filters.mood === mood
                          ? 'bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream shadow-lg scale-105'
                          : 'hover:border-coffee-brown hover:bg-coffee-brown/10 text-coffee-dark hover:scale-105'
                      }`}
                      onClick={() => onFilterChange({ 
                        ...filters, 
                        mood: filters.mood === mood ? null : mood 
                      })}
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Время суток */}
              <div>
                <label className="font-semibold text-coffee-dark mb-4 block text-lg">
                  Время суток
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {timesOfDay.map((time) => (
                    <Button
                      key={time.value}
                      variant={filters.timeOfDay === time.value ? 'default' : 'outline'}
                      className={`h-14 rounded-2xl transition-all duration-300 text-base font-medium border-2 border-coffee-brown/40 ${
                        filters.timeOfDay === time.value
                          ? 'bg-gradient-to-r from-coffee-brown to-coffee-dark text-cream shadow-lg scale-105'
                          : 'hover:border-coffee-brown hover:bg-coffee-brown/10 text-coffee-dark hover:scale-105'
                      }`}
                      onClick={() => onFilterChange({ 
                        ...filters, 
                        timeOfDay: filters.timeOfDay === time.value ? null : time.value 
                      })}
                    >
                      {time.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Крепость */}
              <div>
                <label className="font-semibold text-coffee-dark mb-4 block text-lg">
                  Крепость: <span className="text-coffee-brown">{filters.minStrength || 1} - {filters.maxStrength || 5}</span>
                </label>
                <div className="space-y-6 bg-white/70 rounded-2xl p-5 border-2 border-coffee-brown/40">
                  <div>
                    <p className="text-sm text-coffee-brown/70 mb-3 font-medium">Минимум: {filters.minStrength || 1}</p>
                    <Slider
                      value={[filters.minStrength || 1]}
                      onValueChange={([value]) => onFilterChange({ ...filters, minStrength: value })}
                      min={1}
                      max={5}
                      step={1}
                      className="[&_[role=slider]]:bg-coffee-brown [&_[role=slider]]:border-cream [&_[role=slider]]:shadow-lg [&_[role=slider]]:rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-coffee-brown/70 mb-3 font-medium">Максимум: {filters.maxStrength || 5}</p>
                    <Slider
                      value={[filters.maxStrength || 5]}
                      onValueChange={([value]) => onFilterChange({ ...filters, maxStrength: value })}
                      min={1}
                      max={5}
                      step={1}
                      className="[&_[role=slider]]:bg-coffee-brown [&_[role=slider]]:border-cream [&_[role=slider]]:shadow-lg [&_[role=slider]]:rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-2 border-coffee-brown/40 hover:border-coffee-accent hover:bg-coffee-accent/10 text-coffee-dark transition-all duration-300 font-medium"
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                  }}
                >
                  Сбросить
                </Button>
                <Button
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-coffee-brown to-coffee-dark hover:from-coffee-dark hover:to-coffee-brown text-cream shadow-lg hover:shadow-xl transition-all duration-300 font-medium border-2 border-coffee-brown"
                  onClick={() => setIsOpen(false)}
                >
                  Применить
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}