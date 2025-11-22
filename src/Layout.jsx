import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Coffee, Heart, Compass, Sparkles } from 'lucide-react';

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Главная', path: 'Home', icon: Coffee },
    { name: 'Подбор', path: 'Discovery', icon: Compass },
    { name: 'Избранное', path: 'Favorites', icon: Heart }
  ];

  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/drink') return 'DrinkDetails';
    if (path === '/favorites') return 'Favorites';
    if (path === '/discovery') return 'Discovery';
    return 'Home';
  };

  const currentPageName = getCurrentPageName();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-cream via-white to-amber-50">
      {/* Навигация */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-primary-cream/95 backdrop-blur-md shadow-lg py-3' : 'bg-primary-cream py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Логотип */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-dark to-neutral-charcoal flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform duration-300">
                  <Coffee className="w-6 h-6 text-primary-gold" strokeWidth={2.5} />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-primary-gold animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-primary-dark tracking-tight">
                  Bruno<span className="text-primary-gold">Coffee</span>
                </h1>
                <p className="font-mono text-[10px] text-primary-dark uppercase tracking-wider opacity-60">
                  Premium Experience
                </p>
              </div>
            </Link>

            {/* Навигационное меню */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.path;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-dark text-primary-cream shadow-lg'
                        : 'text-neutral-charcoal hover:bg-primary-dark hover:text-primary-cream hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Мобильное меню */}
            <div className="md:hidden flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPageName === item.path;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-primary-dark text-primary-cream'
                        : 'text-neutral-charcoal hover:bg-primary-dark hover:text-primary-cream'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="pt-24">
        {children}
      </main>

      {/* Футер */}
      <footer className="mt-12 border-t border-primary-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-primary-gold" />
              <div>
                <p className="font-display text-lg font-semibold text-primary-dark">
                  BrunoCoffee
                </p>
                <p className="text-sm text-primary-dark opacity-70">
                  Премиальный опыт для ценителей кофе
                </p>
              </div>
            </div>
            <p className="font-mono text-xs text-primary-dark opacity-60 uppercase tracking-wider">
               © 2025 • Создано с любовью к кофе<br />
                Мнацаканян Ваге АА-22-08
            </p>
          </div>
        </div>
      </footer>

      {/* Декоративные элементы */}
      <div className="fixed top-20 right-10 w-64 h-64 bg-primary-gold/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-accent-bronze/5 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
}