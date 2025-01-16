<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Button from 'primevue/button';
import api from './Axios';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { store } from './store';

const router = useRouter();

// Fetch user details if logged in
onMounted(async () => {
  if (store.isLoggedIn && !store.userRole) { // Fetch only if role is not already set
    try {
      const response = await api.get('/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      });
      store.userName = response.data.name; // Update the global store
      store.userRole = response.data.role; // Store the user role
    } catch (error) {
      console.error('Error fetching user details:', error);
      store.isLoggedIn = false;
    }
  }
});

// Logout function
const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_role');
  store.isLoggedIn = false;
  store.userName = '';
  store.userRole = ''; // Clear the user role
  router.push('/login');
};

// Reactive computed properties
const isAdmin = computed(() => store.userRole === 'Admin');
const isLoggedIn = computed(() => store.isLoggedIn);
const userName = computed(() => store.userName);
</script>

<template>
  <div>
    <!-- Navbar -->
    <div class="navbar">
      <div class="navbar-brand">
        <h2>Netflix</h2>
      </div>  
      <div class="navbar-menu">
      </div>
      <div class="navbar-actions">
        <!-- Conditional Rendering -->
        <template v-if="isLoggedIn">
          <span>{{ userName }}</span>
          <template v-if="isAdmin">
            <Button label="Admin" class="p-button-warning" @click="router.push('/admin')" />
          </template>
          <Button label="Logout" class="p-button-outlined" @click="handleLogout" />
        </template>
        <template v-else>
          <RouterLink to="/login">
            <Button label="Login" class="p-button" />
          </RouterLink>
          <RouterLink to="/register">
            <Button label="Register" class="p-button-outlined" />
          </RouterLink>
        </template>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e5e5e5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand h2 {
  margin: 0;
}

.navbar-menu {
  display: flex;
  gap: 1rem;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main-content {
  padding-top: 80px; /* Adjust to match navbar height */
}
</style>
