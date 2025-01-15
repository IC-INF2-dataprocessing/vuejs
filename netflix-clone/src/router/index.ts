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
  
  // Allow access to login and register without a token
  if (to.path === '/login' || to.path === '/register') {
    if (token) {
      return next('/dashboard');
    }
    return next();
  }

  // If no token and trying to access protected route, redirect to login
  if (!token && to.meta.requiresAuth) {
    return next('/login');
  }

  // If we have a token, verify it and get user role
  if (token) {
    try {
      // Only fetch user role if we don't have it
      if (store.userRole === undefined) {
        const response = await axios.get('http://localhost:9000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Handle null role case
        store.userRole = response.data.user.role || 'User'; // Default to 'User' if role is null
        store.isLoggedIn = true;
      }

      // If trying to access admin page without admin role
      if (to.path === '/admin' && store.userRole !== 'Admin') {
        console.log('Non-admin user attempting to access admin page. Redirecting to dashboard.');
        return next('/dashboard');
      }

      // Allow access to dashboard and other protected routes
      return next();

    } catch (error) {
      console.error('Authentication error:', error);
      
      // If we get a 429 error (too many requests), wait and redirect to dashboard
      if (error.response?.status === 429) {
        return next('/dashboard');
      }
      
      // If token is invalid, clear everything and redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        store.isLoggedIn = false;
        store.userRole = undefined;
        return next('/login');
      }
      
      // For other errors, if we have a token, redirect to dashboard
      return next('/dashboard');
    }
  }

  // Default fallthrough - allow navigation
  next();
});

export default router;