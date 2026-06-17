<template>
  <v-app :theme="theme">
    <!-- Navbar / App Bar hanya tampil jika BUKAN di halaman login -->
    <v-app-bar v-if="!isLoginPage" elevation="0" class="px-2 px-md-4 bg-glass border-b">
      <v-avatar color="primary" size="36" class="me-3 elevation-2">
        <v-icon icon="mdi-hexagon-multiple" color="white" size="20"></v-icon>
      </v-avatar>
      <v-app-bar-title class="font-weight-black text-primary text-h6" style="cursor: pointer;" @click="$router.push('/dashboard')">
        Nabila<span class="text-secondary">Store</span>
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Toggle Dark/Light Mode -->
      <v-btn icon @click="toggleTheme" class="me-2 text-medium-emphasis" variant="tonal">
        <v-icon :icon="theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"></v-icon>
        <v-tooltip activator="parent" location="bottom">
          Ganti ke {{ theme === 'light' ? 'Dark Mode' : 'Light Mode' }}
        </v-tooltip>
      </v-btn>

      <!-- User Profile & Logout -->
      <v-menu transition="slide-y-transition" :close-on-content-click="true">
        <template v-slot:activator="{ props }">
          <v-btn variant="elevated" color="primary" class="rounded-pill px-4 text-none font-weight-bold" v-bind="props" elevation="2">
            <v-icon icon="mdi-account-circle" class="me-2"></v-icon>
            Administrator
            <v-icon icon="mdi-chevron-down" class="ms-1"></v-icon>
          </v-btn>
        </template>
        <v-list class="mt-2 rounded-xl shadow-lg border pa-2" min-width="200">
          <v-list-item class="mb-2">
            <div class="d-flex align-center pa-2">
              <v-avatar color="primary-lighten-4" size="40" class="me-3">
                <v-icon icon="mdi-account" color="primary"></v-icon>
              </v-avatar>
              <div>
                <p class="text-subtitle-2 font-weight-bold mb-0">Admin Nabila</p>
                <p class="text-caption text-medium-emphasis mb-0">admin@store.com</p>
              </div>
            </div>
          </v-list-item>
          <v-divider class="mb-2"></v-divider>
          <v-list-item prepend-icon="mdi-logout" class="text-red rounded-lg menu-hover" @click="handleLogout">
            <v-list-item-title class="font-weight-bold">Logout Keluar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="bg-background-custom">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      theme: 'light'
    };
  },
  computed: {
    isLoginPage() {
      return this.$route.path === '/';
    }
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      // Auto detect OS preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.theme = 'dark';
      }
    }
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
    },
    handleLogout() {
      localStorage.removeItem('token');
      this.$router.push('/');
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', sans-serif !important;
}

.bg-glass {
  background: rgba(var(--v-theme-surface), 0.85) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

.bg-background-custom {
  background-color: rgba(var(--v-theme-background), 1);
  min-height: 100vh;
}

.menu-hover:hover {
  background-color: rgba(244, 67, 54, 0.1) !important;
}

.shadow-lg {
  box-shadow: 0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.03) !important;
}

/* Scrollbar styling minimalis */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-on-surface), 0.4);
}
</style>