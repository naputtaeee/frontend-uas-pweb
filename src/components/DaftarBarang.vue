<template>
  <v-container class="pa-4 pa-md-8" max-width="1300">
    <!-- Header Section -->
    <div class="d-flex flex-column flex-md-row justify-space-between align-start align-md-center mb-8">
      <div class="mb-4 mb-md-0">
        <h1 class="text-h3 font-weight-black text-primary d-flex align-center mb-1">
          NABILA
        </h1>
        <p class="text-body-1 text-medium-emphasis">Pantau analitik dan kelola inventaris toko dengan mudah</p>
      </div>
      
      <div class="d-flex gap-3 w-100 w-md-auto">
        <v-btn
          color="white"
          variant="elevated"
          size="large"
          class="text-none font-weight-bold rounded-lg flex-grow-1 flex-md-grow-0 text-primary border"
          prepend-icon="mdi-microsoft-excel"
          elevation="1"
          @click="exportCSV"
        >
          Export CSV
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          size="large"
          class="text-none font-weight-bold rounded-lg saas-btn transition-swing flex-grow-1 flex-md-grow-0"
          prepend-icon="mdi-plus"
          elevation="4"
          @click="openAddDialog"
        >
          Tambah Barang
        </v-btn>
      </div>
    </div>

    <!-- Dashboard Summary Cards (UNEXPECTED FEATURE) -->
    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-card class="rounded-xl summary-card gradient-primary" elevation="8">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-subtitle-2 font-weight-bold text-white opacity-80 mb-1 text-uppercase tracking-wide">Total Produk</p>
                <h2 class="text-h3 font-weight-black text-white">{{ items.length }}</h2>
              </div>
              <v-avatar color="rgba(255,255,255,0.25)" size="72" class="glass-avatar">
                <v-icon icon="mdi-package-variant-closed" size="36" color="white"></v-icon>
              </v-avatar>
            </div>
            <div class="mt-4 text-white opacity-80 text-caption font-weight-medium d-flex align-center">
              <v-icon icon="mdi-arrow-up-circle" size="16" class="me-1"></v-icon>
              Data terupdate secara realtime
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-card class="rounded-xl summary-card gradient-success" elevation="8">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-subtitle-2 font-weight-bold text-white opacity-80 mb-1 text-uppercase tracking-wide">Estimasi Nilai Aset</p>
                <h2 class="text-h4 font-weight-black text-white">Rp {{ formatPrice(totalAset) }}</h2>
              </div>
              <v-avatar color="rgba(255,255,255,0.25)" size="72" class="glass-avatar">
                <v-icon icon="mdi-finance" size="36" color="white"></v-icon>
              </v-avatar>
            </div>
            <div class="mt-4 text-white opacity-80 text-caption font-weight-medium d-flex align-center">
              <v-icon icon="mdi-cash-multiple" size="16" class="me-1"></v-icon>
              Kalkulasi dari Harga &times; Stok
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="rounded-xl summary-card gradient-warning" elevation="8">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-subtitle-2 font-weight-bold text-white opacity-80 mb-1 text-uppercase tracking-wide">Stok Menipis (< 10)</p>
                <h2 class="text-h3 font-weight-black text-white">{{ lowStockCount }}</h2>
              </div>
              <v-avatar color="rgba(255,255,255,0.25)" size="72" class="glass-avatar">
                <v-icon icon="mdi-alert-decagram" size="36" color="white"></v-icon>
              </v-avatar>
            </div>
            <div class="mt-4 text-white opacity-80 text-caption font-weight-medium d-flex align-center">
              <v-icon icon="mdi-refresh" size="16" class="me-1"></v-icon>
              Segera lakukan restock ulang
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Table Card -->
    <v-card class="rounded-xl border shadow-lg bg-surface" elevation="0">
      
      <!-- Toolbar / Search Area -->
      <v-card-text class="bg-surface-light border-bottom pa-4 pa-md-6 d-flex flex-column flex-sm-row align-sm-center justify-space-between">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Cari berdasarkan nama atau ID..."
          variant="outlined"
          density="comfortable"
          color="primary"
          bg-color="surface"
          hide-details
          class="rounded-lg shadow-sm"
          style="max-width: 400px; width: 100%;"
          clearable
        ></v-text-field>
        
        <v-chip color="primary" variant="tonal" class="mt-4 mt-sm-0 font-weight-bold px-4 rounded-lg" size="large">
          <v-icon icon="mdi-database-check" start></v-icon>
          Sistem Online
        </v-chip>
      </v-card-text>

      <!-- Skeleton Loader (Loading State) -->
      <v-skeleton-loader
        v-if="loading && items.length === 0"
        type="table-thead, table-tbody"
        class="bg-transparent pa-4"
      ></v-skeleton-loader>

      <!-- Data Table Vuetify -->
      <v-data-table
        v-else
        :headers="headers"
        :items="items"
        :search="search"
        :loading="loading"
        class="saas-table"
        hover
        :items-per-page="10"
      >
        <template v-slot:loading>
          <v-progress-linear color="primary" height="4" indeterminate class="rounded-pill"></v-progress-linear>
        </template>

        <!-- Kustomisasi Kolom ID -->
        <template v-slot:item.id_produk="{ item }">
          <span class="text-medium-emphasis font-weight-bold text-caption bg-surface-variant px-2 py-1 rounded-sm">
            #PRD-{{ String(item.id_produk).padStart(4, '0') }}
          </span>
        </template>

        <!-- Kustomisasi Kolom Nama Produk -->
        <template v-slot:item.nama_produk="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="primary-lighten-4" size="36" class="me-3 border">
              <span class="text-primary font-weight-bold text-caption">{{ item.nama_produk.substring(0,2).toUpperCase() }}</span>
            </v-avatar>
            <span class="font-weight-bold text-high-emphasis text-body-1">{{ item.nama_produk }}</span>
          </div>
        </template>

        <!-- Kustomisasi Kolom Harga -->
        <template v-slot:item.harga="{ item }">
          <span class="text-primary font-weight-black">Rp {{ formatPrice(item.harga) }}</span>
        </template>
        
        <!-- Kustomisasi Kolom Stok -->
        <template v-slot:item.stok="{ item }">
          <v-chip
            :color="getStockColor(item.stok)"
            size="small"
            class="font-weight-bold px-3 shadow-sm text-uppercase"
            variant="flat"
            prepend-icon="mdi-circle-small"
          >
            {{ item.stok }} Pcs
          </v-chip>
        </template>

        <!-- Kolom Aksi -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-center align-center">
            <v-btn
              prepend-icon="mdi-pencil"
              variant="tonal"
              size="small"
              color="primary"
              class="me-2 text-none font-weight-bold rounded-lg"
              @click="editItem(item)"
            >
              Edit
            </v-btn>
            
            <v-btn
              prepend-icon="mdi-delete"
              variant="tonal"
              size="small"
              color="error"
              class="text-none font-weight-bold rounded-lg"
              @click="deleteItem(item)"
            >
              Hapus
            </v-btn>
          </div>
        </template>
        
        <!-- Empty State -->
        <template v-slot:no-data>
          <div class="pa-12 text-center d-flex flex-column align-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png" alt="No Data" width="120" style="opacity: 0.5;" class="mb-4 grayscale">
            <h3 class="text-h5 font-weight-bold mb-2 text-high-emphasis">Data Kosong</h3>
            <p class="text-body-1 text-medium-emphasis mb-6 max-w-sm">
              Sistem tidak menemukan data produk. Tambahkan barang baru atau sesuaikan pencarian Anda.
            </p>
            <v-btn 
              color="primary" 
              variant="elevated" 
              prepend-icon="mdi-plus" 
              class="font-weight-bold rounded-lg px-6"
              size="large"
              @click="openAddDialog"
            >
              Tambah Barang Sekarang
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog Form -->
    <v-dialog v-model="dialog" max-width="500px" transition="dialog-bottom-transition" persistent>
      <v-card class="rounded-xl shadow-xl overflow-hidden">
        <div class="bg-primary text-white pa-6 d-flex align-center justify-space-between">
          <div class="d-flex align-center">
             <v-avatar color="white" size="40" class="me-3 elevation-2">
               <v-icon :icon="editedIndex === -1 ? 'mdi-plus' : 'mdi-pencil'" color="primary"></v-icon>
             </v-avatar>
             <h2 class="text-h5 font-weight-bold mb-0">{{ formTitle }}</h2>
          </div>
          <v-btn icon="mdi-close" variant="text" color="white" @click="closeDialog"></v-btn>
        </div>

        <v-card-text class="pa-6 pt-8">
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedItem.nama_produk"
              :rules="[v => !!v || 'Nama Produk wajib diisi']"
              label="Nama Produk Lengkap"
              variant="outlined"
              bg-color="surface"
              prepend-inner-icon="mdi-text-box-outline"
              class="rounded-lg font-weight-medium mb-2 custom-input"
              required
            ></v-text-field>
            
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formattedHarga"
                  :rules="[v => !!v || 'Harga tidak valid']"
                  label="Harga Jual (Rp)"
                  variant="outlined"
                  bg-color="surface"
                  prepend-inner-icon="mdi-cash"
                  class="rounded-lg font-weight-medium custom-input"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="editedItem.stok"
                  :rules="[v => v >= 0 || 'Stok tidak valid']"
                  label="Jumlah Stok"
                  type="number"
                  variant="outlined"
                  bg-color="surface"
                  prepend-inner-icon="mdi-package-variant-closed"
                  class="rounded-lg font-weight-medium custom-input"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0 bg-surface">
          <v-spacer></v-spacer>
          <v-btn color="medium-emphasis" variant="tonal" class="font-weight-bold px-6 rounded-lg" @click="closeDialog" size="large">
            Batal
          </v-btn>
          <v-btn 
            color="primary" 
            variant="elevated" 
            elevation="4"
            class="font-weight-bold rounded-lg px-8 ms-3"
            size="large"
            :disabled="!valid"
            :loading="saving"
            @click="saveItem"
          >
            Simpan Data
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Hapus -->
    <v-dialog v-model="dialogDelete" max-width="400px" transition="dialog-fade-transition" persistent>
      <v-card class="rounded-xl shadow-xl text-center pa-8">
        <div class="delete-icon-wrapper mx-auto mb-6">
          <v-icon icon="mdi-trash-can" color="error" size="48"></v-icon>
        </div>
        
        <h3 class="text-h5 font-weight-black mb-2">Konfirmasi Penghapusan</h3>
        <p class="text-body-1 text-medium-emphasis mb-8">
          Anda akan menghapus data <strong class="text-high-emphasis">"{{ editedItem.nama_produk }}"</strong>. 
          <br>Data yang dihapus tidak dapat dipulihkan.
        </p>

        <v-row no-gutters class="gap-3">
          <v-col>
            <v-btn color="medium-emphasis" variant="tonal" class="font-weight-bold rounded-lg w-100" size="large" @click="closeDelete">
              Batal
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="error" variant="elevated" elevation="4" class="font-weight-bold rounded-lg w-100" size="large" @click="deleteItemConfirm">
              Hapus Permanen
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar Notifikasi (Toast) -->
    <v-snackbar 
      v-model="snackbar.show" 
      :color="snackbar.color" 
      :timeout="4000" 
      location="bottom right"
      elevation="8"
      class="rounded-pill-snackbar"
      variant="elevated"
    >
      <div class="d-flex align-center font-weight-bold">
        <v-icon :icon="snackbar.icon" class="me-3 bg-white text-black rounded-circle pa-1" size="24"></v-icon>
        {{ snackbar.text }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" icon="mdi-close" size="small" @click="snackbar.show = false"></v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DaftarBarang',
  data() {
    return {
      search: '',
      loading: true,
      saving: false,
      valid: true,
      dialog: false,
      dialogDelete: false,
      headers: [
        { title: 'ID PRODUK', align: 'start', key: 'id_produk', class: 'font-weight-black text-caption text-uppercase' },
        { title: 'INFORMASI BARANG', key: 'nama_produk', class: 'font-weight-black text-caption text-uppercase' },
        { title: 'HARGA SATUAN', key: 'harga', class: 'font-weight-black text-caption text-uppercase' },
        { title: 'STOK TERSEDIA', key: 'stok', class: 'font-weight-black text-caption text-uppercase' },
        { title: 'MANAJEMEN', key: 'actions', sortable: false, align: 'center', class: 'font-weight-black text-caption text-uppercase' }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        id_produk: '',
        nama_produk: '',
        harga: 0,
        stok: 0
      },
      defaultItem: {
        id_produk: '',
        nama_produk: '',
        harga: 0,
        stok: 0
      },
      snackbar: {
        show: false,
        text: '',
        color: 'success',
        icon: 'mdi-check-circle'
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tambah Produk Baru' : 'Perbarui Data Produk';
    },
    totalAset() {
      return this.items.reduce((sum, item) => sum + (item.harga * item.stok), 0);
    },
    lowStockCount() {
      return this.items.filter(item => item.stok < 10).length;
    },
    formattedHarga: {
      get() {
        if (!this.editedItem.harga) return '';
        return new Intl.NumberFormat('id-ID').format(this.editedItem.harga);
      },
      set(val) {
        if (!val) {
          this.editedItem.harga = 0;
          return;
        }
        const numericVal = String(val).replace(/\D/g, '');
        this.editedItem.harga = numericVal ? parseInt(numericVal, 10) : 0;
      }
    }
  },
  watch: {
    dialog(val) {
      val || this.closeDialog();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    showSnackbar(text, type = 'success') {
      this.snackbar.text = text;
      this.snackbar.color = type;
      this.snackbar.icon = type === 'success' ? 'mdi-check' : 'mdi-alert';
      this.snackbar.show = true;
    },
    formatPrice(value) {
      if (!value) return 0;
      return new Intl.NumberFormat('id-ID').format(value);
    },
    getStockColor(stok) {
      if (stok === 0) return 'error';
      if (stok < 10) return 'warning';
      return 'success';
    },
    async fetchData() {
  this.loading = true;
  try {
    // Menggunakan variabel dari .env
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/barang`);
    this.items = response.data;
  } catch (error) {
    console.error("Gagal ambil data:", error);
    this.showSnackbar('Gagal terhubung ke Database', 'error');
  } finally {
    this.loading = false;
  }
},
    openAddDialog() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = true;
      if (this.$refs.form) this.$refs.form.resetValidation();
    },
    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    async deleteItemConfirm() {
      try {
        await axios.delete(`https://backend-uas-pweb.vercel.app/api/barang/${this.editedItem.id_produk}`);
        this.items.splice(this.editedIndex, 1);
        this.showSnackbar('Produk berhasil dihapus secara permanen');
      } catch (error) {
        console.error("Gagal hapus data:", error);
        this.showSnackbar('Gagal menghapus data', 'error');
      }
      this.closeDelete();
    },
    closeDialog() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        if (this.$refs.form) this.$refs.form.resetValidation();
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async saveItem() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) return;

      this.saving = true;
      try {
        if (this.editedIndex > -1) {
          await axios.put(`https://backend-uas-pweb.vercel.app/api/barang/${this.editedItem.id_produk}`, {
            nama_produk: this.editedItem.nama_produk,
            harga: this.editedItem.harga,
            stok: this.editedItem.stok
          });
          Object.assign(this.items[this.editedIndex], this.editedItem);
          this.showSnackbar('Data produk berhasil diperbarui');
        } else {
          const response = await axios.post('https://backend-uas-pweb.vercel.app/api/barang', { 
            nama_produk: this.editedItem.nama_produk,
            harga: this.editedItem.harga,
            stok: this.editedItem.stok
          });
          
          this.editedItem.id_produk = response.data.id_produk;
          this.items.unshift(Object.assign({}, this.editedItem)); // Push ke paling atas
          this.showSnackbar('Produk baru sukses ditambahkan');
        }
        this.closeDialog();
      } catch (error) {
        console.error("Gagal simpan data:", error);
        this.showSnackbar('Gagal menyimpan data ke server', 'error');
      } finally {
        this.saving = false;
      }
    },
    // FITUR UNEXPECTED: Export Data ke CSV
    exportCSV() {
      if (this.items.length === 0) return this.showSnackbar('Tidak ada data untuk diekspor', 'warning');
      
      const headers = ['ID Produk', 'Nama Produk', 'Harga Satuan', 'Stok'];
      const rows = this.items.map(item => [
        `PRD-${item.id_produk}`, 
        `"${item.nama_produk}"`, 
        item.harga, 
        item.stok
      ]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
        
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Laporan_Stok_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showSnackbar('Laporan CSV berhasil diunduh');
    }
  }
};
</script>

<style scoped>
/* DASHBOARD WIDGET CARDS GRADIEN */
.summary-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  border: none !important;
}
.summary-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2) !important;
}

.gradient-primary { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%) !important; }
.gradient-success { background: linear-gradient(135deg, #059669 0%, #10b981 100%) !important; }
.gradient-warning { background: linear-gradient(135deg, #ea580c 0%, #f59e0b 100%) !important; }

.glass-avatar {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

.tracking-wide { letter-spacing: 0.05em; }

/* TABLE RE-STYLING */
.saas-table :deep(tbody tr) {
  transition: all 0.2s;
  cursor: pointer;
}
.saas-table :deep(tbody tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.02) !important;
  transform: scale(1.002);
}
.saas-table :deep(thead th) {
  background-color: rgba(var(--v-theme-surface-variant), 0.2) !important;
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
  border-bottom: 2px solid rgba(var(--v-border-color), 0.1) !important;
  font-size: 0.8rem !important;
}

/* BUTTONS & ICONS */
.saas-btn {
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%) !important;
  color: white !important;
}
.saas-btn:hover {
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4) !important;
}
.hover-action-btn {
  opacity: 0.7;
}
.saas-table :deep(tbody tr:hover) .hover-action-btn {
  opacity: 1;
}
.hover-action-btn:hover {
  transform: scale(1.1);
}

/* CUSTOM MODAL & DELETE ICON */
.shadow-xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
}
.delete-icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(var(--v-theme-error), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse-red 2s infinite;
}
@keyframes pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.4); }
  70% { box-shadow: 0 0 0 20px rgba(var(--v-theme-error), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0); }
}

.custom-input :deep(.v-field) {
  border-radius: 10px;
}
.gap-3 { gap: 12px; }

/* SNACKBAR CUSTOM */
:deep(.v-snackbar__wrapper) {
  border-radius: 16px !important;
  padding: 4px;
}
</style>