// ===== Hash-Based SPA Router =====

const routes = {};
let currentRoute = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  return currentRoute;
}

export function initRouter() {
  const handleRoute = () => {
    const hash = window.location.hash.slice(1) || '/';
    currentRoute = hash;

    const handler = routes[hash];
    if (handler) {
      handler();
    } else {
      // Default to login if route not found
      navigate('/login');
    }
  };

  window.addEventListener('hashchange', handleRoute);
  handleRoute(); // Handle initial route
}
