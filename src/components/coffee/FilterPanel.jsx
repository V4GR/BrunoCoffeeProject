import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [isOpen, setIsOpen] = React.useState(false);

  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'espresso', label: 'Эспрессо' },
    { value: 'milk_based', label: 'Молочные' },
    { value: 'cold_brew', label: 'Холодные' },
    { value: 'filter', label: 'Фильтр кофе' },
    { value: 'specialty', label: 'Специальные' }
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

  const hasActiveFilters = filters.category !== 'all' || 
    filters.mood || 
    filters.timeOfDay || 
    filters.minStrength > 1 ||
    filters.maxStrength < 5;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-primary-gold/20 p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Поиск */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-slate" />
          <Input
            type="text"
            placeholder="Найти напиток..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-12 h-12 rounded-2xl border-primary-gold/30 focus:border-primary-gold bg-white text-primary-dark"
          />
        </div>

        {/* Категория */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => onFilterChange({ ...filters, category: value })}
        >
          <SelectTrigger className="w-full lg:w-48 h-12 rounded-2xl border-primary-gold/30 bg-white">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Расширенные фильтры */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              className="h-12 rounded-2xl border-primary-gold/30 bg-white hover:bg-primary-gold/10 relative"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Фильтры
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-emerald rounded-full" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-primary-cream">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl text-primary-dark">
                Продвинутые фильтры
              </SheetTitle>
              <SheetDescription className="text-neutral-slate">
                Найдите идеальный напиток под ваше настроение
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 space-y-8">
              {/* Настроение */}
              <div>
                <label className="font-medium text-primary-dark mb-3 block">
                  Настроение
                </label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Badge
                      key={mood}
                      variant={filters.mood === mood ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all duration-200 ${
                        filters.mood === mood
                          ? 'bg-primary-dark text-white'
                          : 'border-primary-gold/30 hover:border-primary-gold text-neutral-charcoal'
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
                <label className="font-medium text-primary-dark mb-3 block">
                  Время суток
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timesOfDay.map((time) => (
                    <Button
                      key={time.value}
                      variant={filters.timeOfDay === time.value ? 'default' : 'outline'}
                      className={`h-12 rounded-xl transition-all duration-200 ${
                        filters.timeOfDay === time.value
                          ? 'bg-primary-dark text-white'
                          : 'border-primary-gold/30 hover:bg-primary-gold/10'
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
                <label className="font-medium text-primary-dark mb-3 block">
                  Крепость: {filters.minStrength || 1} - {filters.maxStrength || 5}
                </label>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-neutral-slate mb-2">Минимум: {filters.minStrength || 1}</p>
                    <Slider
                      value={[filters.minStrength || 1]}
                      onValueChange={([value]) => onFilterChange({ ...filters, minStrength: value })}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-slate mb-2">Максимум: {filters.maxStrength || 5}</p>
                    <Slider
                      value={[filters.maxStrength || 5]}
                      onValueChange={([value]) => onFilterChange({ ...filters, maxStrength: value })}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-primary-gold/30"
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Сбросить
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl bg-primary-dark hover:bg-neutral-charcoal text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Применить
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Кнопка сброса */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            className="h-12 rounded-2xl text-neutral-slate hover:text-primary-dark hover:bg-primary-gold/10"
            onClick={onReset}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}