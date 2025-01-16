import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Admin from '../views/Admin.vue';
import axios from 'axios';
import { store } from '../store';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresRole: 'Admin' },
  },
  {
    path: '/',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('access_token');

  // Allow access to login and register pages if not logged in
  if (to.path === '/login' || to.path === '/register') {
    if (token) {
      return next('/dashboard'); // Redirect to dashboard if already logged in
    }
    return next();
  }

  // Redirect to login if trying to access a protected route without a token
  if (!token && to.meta.requiresAuth) {
    return next('/login');
  }

  // Handle authenticated routes
  if (token) {
    try {
      // Check if user role is already loaded in the store
      if (!store.userRole) {
        // Fetch user details from the API
        const response = await axios.get('http://localhost:9000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract user data, providing fallbacks if undefined
        const user = response.data?.user || {};
        store.userRole = user.role || 'User'; // Default role to 'User'
        store.userName = user.name || '';
        store.isLoggedIn = true;

        // Persist user data to localStorage
        localStorage.setItem('user_role', store.userRole);
        localStorage.setItem('user_name', store.userName);
      }

      // Restrict access to admin routes if the user is not an admin
      if (to.path === '/admin' && store.userRole !== 'Admin') {
        console.log('Non-admin user attempting to access admin page. Redirecting to dashboard.');
        return next('/dashboard');
      }

      return next(); // Allow navigation to the route
    } catch (error) {
      console.error('Authentication error:', error);

      // Handle specific error responses
      if (error.response?.status === 429) {
        console.log('Too many requests. Redirecting to dashboard.');
        return next('/dashboard');
      }

      if (error.response?.status === 401) {
        console.log('Unauthorized. Clearing session and redirecting to login.');
        // Clear localStorage and reset store on authentication failure
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        store.isLoggedIn = false;
        store.userRole = '';
        store.userName = '';
        return next('/login');
      }

      return next('/dashboard'); // Fallback for other errors
    }
  }

  // Default navigation
  next();
});




export default router;