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
  
  if (to.path === '/login' || to.path === '/register') {
    if (token) {
      return next('/dashboard');
    }
    return next();
  }

  if (!token && to.meta.requiresAuth) {
    return next('/login');
  }

  if (token) {
    try {
      if (!store.userRole) {
        const response = await axios.get('http://localhost:9000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data.user;

        store.userRole = user.role || 'User'; // Default to 'User' if role is null
        store.userName = user.name || '';
        store.isLoggedIn = true;

        // Persist role and name in localStorage
        localStorage.setItem('user_role', store.userRole);
        localStorage.setItem('user_name', store.userName);
      }

      if (to.path === '/admin' && store.userRole !== 'Admin') {
        console.log('Non-admin user attempting to access admin page. Redirecting to dashboard.');
        return next('/dashboard');
      }

      return next();
    } catch (error) {
      console.error('Authentication error:', error);

      if (error.response?.status === 429) {
        return next('/dashboard');
      }

      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        store.isLoggedIn = false;
        store.userRole = '';
        store.userName = '';
        return next('/login');
      }

      return next('/dashboard');
    }
  }

  next();
});


export default router;