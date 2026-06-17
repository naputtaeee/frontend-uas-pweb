import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/LoginPage.vue';
import DaftarBarang from './components/DaftarBarang.vue'; // Import komponen tabel kamu

const routes = [
  { path: '/', component: LoginPage },
  { path: '/dashboard', component: DaftarBarang }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;