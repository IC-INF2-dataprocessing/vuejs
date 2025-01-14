<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { store } from '../store';


const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter(); // Import and initialize router


const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:9000/api/login', {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem('access_token', response.data.access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;

    // Fetch user details
    const userResponse = await axios.get('http://localhost:9000/api/user', {
      headers: { Authorization: `Bearer ${response.data.access_token}` },
    });

    store.isLoggedIn = true;
    store.userName = userResponse.data.name; // Update global store

    router.push('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.';
  }
};

</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
