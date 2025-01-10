<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Button from 'primevue/button';
import api from './Axios'; 
import { ref, onMounted } from 'vue';

</script>

<template>
  <div>
    <!-- Navbar -->
    <div class="navbar">
      <div class="navbar-brand">
        <h2>Netflix</h2>
      </div>
      <div class="navbar-menu">
        <Button label="Home" class="p-button-text" />
        <Button label="About" class="p-button-text" />
        <Button label="Contact" class="p-button-outlined" />
      </div>
      <div class="navbar-actions">
        <RouterLink to="/login">
          <Button label="Login" class="p-button" />
        </RouterLink>
        <RouterLink to="/register">
        <Button label="Register" class="p-button-outlined" />
      </RouterLink>

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
}

.main-content {
  padding-top: 80px; /* Adjust to match navbar height */
}
</style>
