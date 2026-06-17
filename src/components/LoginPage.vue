<template>
  <div class="login-wrapper d-flex align-center justify-center">
    <!-- Dekorasi Background Animasi -->
    <div class="blob-1"></div>
    <div class="blob-2"></div>
    <div class="blob-3"></div>

    <v-card class="glass-card pa-8 pa-md-10 rounded-xl" elevation="24" width="100%" max-width="450">
      <div class="text-center mb-8">
        <v-avatar color="primary" size="80" class="mb-5 shadow-primary">
          <v-icon icon="mdi-hexagon-multiple" size="40" color="white"></v-icon>
        </v-avatar>
        <h1 class="text-h4 font-weight-black text-primary mb-2">Nabila<span class="text-secondary">Store</span></h1>
        <p class="text-body-1 text-medium-emphasis font-weight-medium">Login untuk mengelola inventaris toko</p>
      </div>

      <v-form @submit.prevent="handleLogin" v-model="valid">
        <v-text-field
          v-model="username"
          label="Username Administrator"
          variant="solo-filled"
          prepend-inner-icon="mdi-account-circle-outline"
          class="mb-4 custom-input font-weight-medium"
          :rules="[v => !!v || 'Username tidak boleh kosong']"
          flat
          bg-color="surface"
        ></v-text-field>
        
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          variant="solo-filled"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          class="mb-6 custom-input font-weight-medium"
          :rules="[v => !!v || 'Password tidak boleh kosong']"
          flat
          bg-color="surface"
        ></v-text-field>

        <v-expand-transition>
          <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-6 rounded-lg font-weight-medium text-caption" border="start" density="compact">
            {{ errorMsg }}
          </v-alert>
        </v-expand-transition>

        <v-btn 
          type="submit" 
          size="x-large" 
          block 
          class="rounded-lg font-weight-bold text-none login-btn mt-2"
          :loading="loading"
        >
          Masuk ke Dashboard
          <v-icon icon="mdi-arrow-right" class="ms-2"></v-icon>
        </v-btn>
      </v-form>
      
      <div class="text-center mt-8 pt-4 border-t">
        <p class="text-caption text-medium-emphasis">
          Project UAS Web Programming &copy; 2026
        </p>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    valid: false,
    loading: false,
    showPassword: false,
    username: '',
    password: '',
    errorMsg: ''
  }),
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) return;
      
      this.loading = true;
      this.errorMsg = '';
      try {
        const res = await axios.post('http://localhost:3000/api/login', {
          username: this.username,
          password: this.password
        });
        localStorage.setItem('token', res.data.token);
        this.$router.push('/dashboard');
      } catch (err) {
        this.errorMsg = err.response?.data?.error || 'Kredensial tidak valid. Silakan coba lagi.';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  width: 100vw;
  background: #f8fafc; /* Slate 50 */
  position: relative;
  overflow: hidden;
  z-index: 1;
}

:global(.v-theme--dark) .login-wrapper {
  background: #0f172a; /* Slate 900 */
}

/* Efek Blob Latar Belakang Animasi Mewah */
.blob-1 {
  position: absolute;
  top: -10%;
  left: -5%;
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.6));
  filter: blur(90px);
  border-radius: 50%;
  animation: float 15s infinite alternate ease-in-out;
  z-index: -1;
}

.blob-2 {
  position: absolute;
  bottom: -15%;
  right: -5%;
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.5), rgba(244, 63, 94, 0.5));
  filter: blur(100px);
  border-radius: 50%;
  animation: float 18s infinite alternate-reverse ease-in-out;
  z-index: -1;
}

.blob-3 {
  position: absolute;
  top: 40%;
  left: 60%;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.5), rgba(59, 130, 246, 0.5));
  filter: blur(80px);
  border-radius: 50%;
  animation: float 20s infinite alternate ease-in-out;
  z-index: -1;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}

.glass-card {
  background: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
}

:global(.v-theme--dark) .glass-card {
  background: rgba(30, 41, 59, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.shadow-primary {
  box-shadow: 0 10px 25px -5px rgba(var(--v-theme-primary), 0.5) !important;
}

/* Custom Vuetify Inputs */
.custom-input :deep(.v-field) {
  border-radius: 12px;
  transition: all 0.3s;
  border: 1px solid rgba(var(--v-border-color), 0.1);
}

.custom-input :deep(.v-field--focused) {
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 0 0 4px rgba(var(--v-theme-primary), 0.1);
}

.login-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important;
  color: white !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.5) !important;
}

.border-t {
  border-top: 1px solid rgba(var(--v-border-color), 0.1);
}
</style>