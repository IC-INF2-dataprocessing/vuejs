<template>
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel!</p>
  
      <!-- User List -->
      <div>
        <h2>User List</h2>
        <ul v-if="users.length > 0">
          <li v-for="user in users" :key="user.id">
            {{ user.name }} ({{ user.email }}) - Role: {{ user.role || 'N/A' }}
            <button @click="editUser(user)">Edit</button>
            <button @click="deleteUser(user.id)">Delete</button>
          </li>
        </ul>
        <p v-else>No users found.</p>
      </div>
  
      <!-- Create User -->
      <div>
        <h2>Create User</h2>
        <form @submit.prevent="createUser">
          <input v-model="newUser.name" placeholder="Name" required />
          <input v-model="newUser.email" placeholder="Email" required />
          <input v-model="newUser.password" placeholder="Password" type="password" required />
          <input v-model="newUser.role_id" placeholder="Role ID" type="number" />
          <button type="submit">Create</button>
        </form>
      </div>
  
      <!-- Edit User -->
      <div v-if="editingUser">
        <h2>Edit User</h2>
        <form @submit.prevent="updateUser">
          <input v-model="editingUser.name" placeholder="Name" />
          <input v-model="editingUser.email" placeholder="Email" />
          <input v-model="editingUser.password" placeholder="Password" type="password" />
          <input v-model="editingUser.role_id" placeholder="Role ID" type="number" />
          <button type="submit">Update</button>
          <button @click="cancelEdit">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  // API Base URL
  const baseUrl = 'http://localhost:9000/api';
  
  // Reactive State
  const users = ref([]);
  const newUser = ref({
    name: '',
    email: '',
    password: '',
    role_id: null,
  });
  const editingUser = ref(null);
  
  // Fetch Users
  const fetchUsers = async () => {
    console.log('Fetching users...');
    try {
      const response = await axios.get(`${baseUrl}/users`);
      console.log('Users fetched:', response.data);
      users.value = response.data; // Adjust based on your API's response format
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  // Create User
  const createUser = async () => {
    try {
      await axios.post(`${baseUrl}/users`, newUser.value);
      alert('User created successfully!');
      fetchUsers();
      newUser.value = { name: '', email: '', password: '', role_id: null };
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  
  // Edit User
  const editUser = (user) => {
    editingUser.value = { ...user, password: '' };
  };
  
  // Update User
  const updateUser = async () => {
    try {
      await axios.put(`${baseUrl}/users/${editingUser.value.id}`, editingUser.value);
      alert('User updated successfully!');
      fetchUsers();
      cancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  
  // Delete User
  const deleteUser = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${baseUrl}/users/${id}`);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  
  // Cancel Edit
  const cancelEdit = () => {
    editingUser.value = null;
  };
  
  // Lifecycle Hook
  onMounted(() => {
    fetchUsers();
  });
  </script>
  
  <style scoped>
  h1 {
    color: #ff6347;
  }
  
  form {
    margin-bottom: 1rem;
  }
  
  button {
    margin-left: 0.5rem;
  }
  </style>
  