import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue'; 
import axios from 'axios'; 

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('access_token'); 

  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login'); 
    } else {
      try {
        await axios.get('http://localhost:9000/api/validate-token', {
          headers: { Authorization: `Bearer ${token}` },
        });
        next(); 
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('access_token'); 
        next('/login'); 
      }
    }
  } else if (to.name === 'Login' && token) {
    next('/dashboard');
  } else {
    next(); 
  }
});

export default router;
