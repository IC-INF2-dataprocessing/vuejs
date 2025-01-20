import { watch } from 'vue';
import { reactive } from 'vue';

export const store = reactive({
  isLoggedIn: !!localStorage.getItem('access_token'),
  userName: localStorage.getItem('user_name') || '',
  userRole: localStorage.getItem('user_role') || 'User',
});

// Watch for changes and persist to localStorage
watch(() => store.userRole, (newRole) => {
  localStorage.setItem('user_role', newRole);
});
watch(() => store.userName, (newName) => {
  localStorage.setItem('user_name', newName);
});
