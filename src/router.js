import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './pages/LandingPage.vue';
import AboutPage from './pages/AboutPage.vue';
import LoginPage from './pages/LoginPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import { useAuth } from './composables/useAuth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: LandingPage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/profile', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
  ],
});

router.beforeEach((to) => {
  const { loggedIn } = useAuth();
  // Redirect to login when a route requires auth and user is not logged in
  if (to.meta?.requiresAuth && !loggedIn.value) {
    return { name: 'login' };
  }
  // Prevent visiting login when already authenticated
  if (to.name === 'login' && loggedIn.value) {
    return { name: 'profile' };
  }
  return true;
});

export default router;
