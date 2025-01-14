import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue'; // Import the Dashboard component

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
    meta: { requiresAuth: true }, // Add meta field to protect the route
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to Protect Routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token'); // Get the token from local storage
  if (to.meta.requiresAuth && !token) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
