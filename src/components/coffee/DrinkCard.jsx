import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Heart, TrendingUp, Sparkles, Flame, Droplet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DrinkCard({ drink, isFavorite, onToggleFavorite }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const getCategoryColor = (category) => {
    const colors = {
      espresso: 'bg-amber-100 text-amber-800 border-amber-200',
      milk_based: 'bg-blue-100 text-blue-800 border-blue-200',
      cold_brew: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      filter: 'bg-green-100 text-green-800 border-green-200',
      specialty: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryName = (category) => {
    const names = {
      espresso: 'Эспрессо',
      milk_based: 'Молочный',
      cold_brew: 'Холодный',
      filter: 'Фильтр',
      specialty: 'Специальный'
    };
    return names[category] || category;
  };

  return (
    <div
      className="group relative transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl border-2 border-primary-gold/0 hover:border-primary-gold/20 transition-all duration-300">
        {/* Изображение */}
        <Link to={createPageUrl('DrinkDetails') + `?id=${drink.id}`} className="block relative h-64 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br from-primary-gold/20 to-transparent transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />
          <img
            src={drink.image_url}
            alt={drink.name}
            className={`w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Бейджи сверху */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge className={`${getCategoryColor(drink.category)} border backdrop-blur-sm`}>
              {getCategoryName(drink.category)}
            </Badge>
            {drink.temperature === 'холодный' && (
              <Badge className="bg-blue-500/90 text-white border-0 backdrop-blur-sm">
                <Droplet className="w-3 h-3 mr-1" />
                Холодный
              </Badge>
            )}
          </div>

          {/* Кнопка избранного */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md transition-all duration-300 ${
              isFavorite
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/80 text-neutral-slate hover:bg-white hover:text-red-500'
            }`}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(drink);
            }}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} strokeWidth={2} />
          </Button>

          {/* Характеристики при наведении */}
          <div className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="bg-white px-3 py-1.5 rounded-lg text-primary-dark text-xs flex items-center gap-1.5 shadow-lg border-2 border-primary-gold">
              <Flame className="w-3.5 h-3.5 text-primary-gold" />
              <span className="font-bold">Крепость: {drink.strength || 0}/5</span>
            </div>
            {drink.caffeine_mg && (
              <div className="bg-white px-3 py-1.5 rounded-lg text-primary-dark text-xs flex items-center gap-1.5 shadow-lg border-2 border-accent-emerald">
                <Sparkles className="w-3.5 h-3.5 text-accent-emerald" />
                <span className="font-bold">{drink.caffeine_mg} мг</span>
              </div>
            )}
          </div>
        </Link>

        {/* Контент карточки */}
        <div className="p-6">
          {/* Название */}
          <Link to={createPageUrl('DrinkDetails') + `?id=${drink.id}`}>
            <h3 className="font-display text-2xl font-bold text-primary-dark mb-2 group-hover:text-primary-gold transition-colors duration-300">
              {drink.name}
            </h3>
            {drink.name_en && (
              <p className="font-mono text-xs text-neutral-slate uppercase tracking-wider mb-3">
                {drink.name_en}
              </p>
            )}
          </Link>

          {/* Описание */}
          <p className="text-sm text-neutral-charcoal mb-4 line-clamp-2 leading-relaxed">
            {drink.description}
          </p>

          {/* Вкусовые характеристики */}
          {(drink.bitterness !== undefined || drink.acidity !== undefined || drink.sweetness !== undefined) && (
            <div className="flex gap-3 mb-4 pb-4 border-b border-primary-gold/20">
              {drink.bitterness !== undefined && (
                <div className="flex-1 text-center">
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, (drink.bitterness / 5) * 100))}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-slate">Горечь</span>
                </div>
              )}
              {drink.acidity !== undefined && (
                <div className="flex-1 text-center">
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, (drink.acidity / 5) * 100))}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-slate">Кислотность</span>
                </div>
              )}
              {drink.sweetness !== undefined && (
                <div className="flex-1 text-center">
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, (drink.sweetness / 5) * 100))}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-slate">Сладость</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}