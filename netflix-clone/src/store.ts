import { reactive } from 'vue';

export const store = reactive({
  isLoggedIn: !!localStorage.getItem('access_token'), // Initialize based on token presence
  userName: localStorage.getItem('user_name') || '', // Persisted user name
  userRole: localStorage.getItem('user_role') || '', // Persisted user role
});
