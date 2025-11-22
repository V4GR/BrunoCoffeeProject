export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'DrinkDetails': '/drink', 
    'Favorites': '/favorites',
    'Discovery': '/discovery'
  };
  return routes[pageName] || '/';
};