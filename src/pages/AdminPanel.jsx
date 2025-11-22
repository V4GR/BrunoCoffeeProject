import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Plus, Edit, Trash2, Coffee, Search, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { coffeeApi } from '@/api/coffeeApi';

export default function AdminPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDrink, setEditingDrink] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();
  const isDevelopment = import.meta.env.DEV;

  // Баннер для Vercel
  const VercelBanner = () => {
    if (isDevelopment) return null;
    
    return (
      <div className="bg-blue-100 border border-blue-400 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌐</span>
          <div>
            <p className="font-semibold text-blue-800">Режим просмотра Vercel</p>
            <p className="text-blue-700 text-sm">
              На Vercel админ-панель работает в режиме демонстрации. 
              Для полного функционала запустите приложение локально.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Загрузка напитков
  const { data: drinks = [], isLoading } = useQuery({
    queryKey: ['drinks'],
    queryFn: () => coffeeApi.getDrinks(),
  });

  // Мутация для удаления напитка
  const deleteMutation = useMutation({
    mutationFn: (id) => coffeeApi.deleteDrink(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['drinks']);
    },
  });

  // Мутация для добавления напитка
  const addMutation = useMutation({
    mutationFn: (drinkData) => coffeeApi.addDrink(drinkData),
    onSuccess: () => {
      queryClient.invalidateQueries(['drinks']);
      setShowForm(false);
      setFormData({});
    },
  });

  // Мутация для обновления напитка
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => coffeeApi.updateDrink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['drinks']);
      setShowForm(false);
      setFormData({});
      setEditingDrink(null);
    },
  });

  // Фильтрация напитков
  const filteredDrinks = drinks.filter(drink =>
    drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drink.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот напиток?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (drink) => {
    setEditingDrink(drink);
    setFormData({
      ...drink,
      bitterness: drink.bitterness || 3,
      sweetness: drink.sweetness || 3,
      acidity: drink.acidity || 3
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingDrink(null);
    setFormData({
      name: '',
      name_en: '',
      description: '',
      category: 'espresso',
      strength: 3,
      bitterness: 3,
      sweetness: 3,
      acidity: 3,
      caffeine_mg: 60,
      temperature: 'горячий',
      image_url: ''
    });
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (editingDrink) {
      updateMutation.mutate({ id: editingDrink.id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-primary-gold mx-auto mb-4 animate-pulse" />
          <p className="text-primary-dark">Загрузка напитков...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-gold/10 border border-primary-gold/30 mb-4">
            <Settings className="w-4 h-4 text-primary-gold" />
            <span className="font-mono text-xs text-primary-dark uppercase tracking-wider">
              Панель администратора
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-dark mb-4">
            Управление напитками
          </h1>
          
          <p className="text-lg text-neutral-charcoal max-w-2xl mx-auto mb-8">
            Добавляйте, редактируйте и удаляйте кофейные напитки
          </p>
        </div>

        {/* Баннер для Vercel */}
        <VercelBanner />

        {/* Панель управления */}
        <Card className="mb-8 border-2 border-primary-gold/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-slate" />
                  <Input
                    placeholder="Поиск напитков..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-primary-gold/30 focus:border-primary-gold"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleAddNew}
                  className="bg-primary-dark hover:bg-neutral-charcoal text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить напиток
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-primary-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-dark mb-2">
                {drinks.length}
              </div>
              <p className="text-sm text-neutral-slate">Всего напитков</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-dark mb-2">
                {drinks.filter(d => d.category === 'espresso').length}
              </div>
              <p className="text-sm text-neutral-slate">Эспрессо напитков</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-dark mb-2">
                {drinks.filter(d => d.category === 'milk_based').length}
              </div>
              <p className="text-sm text-neutral-slate">Молочных напитков</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary-gold/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-dark mb-2">
                {drinks.filter(d => d.temperature === 'холодный').length}
              </div>
              <p className="text-sm text-neutral-slate">Холодных напитков</p>
            </CardContent>
          </Card>
        </div>

        {/* Список напитков */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrinks.map((drink) => (
            <Card key={drink.id} className="border-2 border-primary-gold/20 hover:border-primary-gold/50 transition-all duration-300">
              <CardContent className="p-0">
                {/* Изображение */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={drink.image_url}
                    alt={drink.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-primary-dark border-2 border-primary-dark">
                      {getCategoryName(drink.category)}
                    </Badge>
                  </div>
                </div>

                {/* Контент */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-primary-dark mb-1">
                        {drink.name}
                      </h3>
                      {drink.name_en && (
                        <p className="font-mono text-xs text-neutral-slate uppercase">
                          {drink.name_en}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(drink)}
                        className="w-8 h-8 hover:bg-primary-gold/20"
                      >
                        <Edit className="w-4 h-4 text-primary-dark" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(drink.id)}
                        className="w-8 h-8 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-charcoal mb-4 line-clamp-2">
                    {drink.description}
                  </p>

                  {/* Вкусовые характеристики */}
                  <div className="flex gap-4 mb-3 text-xs">
                    {drink.bitterness !== undefined && (
                      <div className="text-center">
                        <div className="font-semibold text-primary-dark">Горечь</div>
                        <div className="text-neutral-slate">{drink.bitterness}/5</div>
                      </div>
                    )}
                    {drink.sweetness !== undefined && (
                      <div className="text-center">
                        <div className="font-semibold text-primary-dark">Сладость</div>
                        <div className="text-neutral-slate">{drink.sweetness}/5</div>
                      </div>
                    )}
                    {drink.acidity !== undefined && (
                      <div className="text-center">
                        <div className="font-semibold text-primary-dark">Кислотность</div>
                        <div className="text-neutral-slate">{drink.acidity}/5</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-slate">
                    <span>Крепость: {drink.strength}/5</span>
                    <span>{drink.caffeine_mg} мг кофеина</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDrinks.length === 0 && (
          <Card className="text-center py-12 border-2 border-primary-gold/20">
            <Coffee className="w-16 h-16 mx-auto mb-4 text-neutral-slate" />
            <p className="text-neutral-charcoal">Напитки не найдены</p>
          </Card>
        )}
      </div>

      {/* Форма добавления/редактирования */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {editingDrink ? 'Редактирование напитка' : 'Добавление напитка'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Название (рус)
                    </label>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Эспрессо"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Название (англ)
                    </label>
                    <Input
                      value={formData.name_en || ''}
                      onChange={(e) => handleInputChange('name_en', e.target.value)}
                      placeholder="Espresso"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-primary-dark mb-2 block">
                    Описание
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Описание напитка..."
                    className="w-full min-h-[100px] p-3 border-2 border-primary-gold/30 rounded-xl focus:border-primary-gold resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Категория
                    </label>
                    <select
                      value={formData.category || 'espresso'}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-3 border-2 border-primary-gold/30 rounded-xl focus:border-primary-gold"
                    >
                      <option value="espresso">Эспрессо</option>
                      <option value="milk_based">Молочный</option>
                      <option value="cold_brew">Холодный</option>
                      <option value="filter">Фильтр</option>
                      <option value="specialty">Специальный</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Температура
                    </label>
                    <select
                      value={formData.temperature || 'горячий'}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                      className="w-full p-3 border-2 border-primary-gold/30 rounded-xl focus:border-primary-gold"
                    >
                      <option value="горячий">Горячий</option>
                      <option value="холодный">Холодный</option>
                    </select>
                  </div>
                </div>

                {/* Вкусовые характеристики */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Крепость: {formData.strength || 3}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.strength || 3}
                      onChange={(e) => handleInputChange('strength', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Горечь: {formData.bitterness || 3}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.bitterness || 3}
                      onChange={(e) => handleInputChange('bitterness', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Сладость: {formData.sweetness || 3}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.sweetness || 3}
                      onChange={(e) => handleInputChange('sweetness', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Кислотность: {formData.acidity || 3}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.acidity || 3}
                      onChange={(e) => handleInputChange('acidity', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-primary-dark mb-2 block">
                      Кофеин (мг)
                    </label>
                    <Input
                      type="number"
                      value={formData.caffeine_mg || 60}
                      onChange={(e) => handleInputChange('caffeine_mg', parseInt(e.target.value))}
                      placeholder="60"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-primary-dark mb-2 block">
                    URL изображения
                  </label>
                  <Input
                    value={formData.image_url || ''}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary-dark hover:bg-neutral-charcoal text-white"
                    disabled={addMutation.isLoading || updateMutation.isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingDrink ? 'Обновить' : 'Добавить'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}