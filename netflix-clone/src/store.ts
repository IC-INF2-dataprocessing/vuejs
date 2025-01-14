import { reactive } from 'vue';

export const store = reactive({
  isLoggedIn: !!localStorage.getItem('access_token'), // Initialize based on token presence
  userName: '',
});
