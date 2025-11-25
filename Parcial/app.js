const apiUsuarios = 'http://127.0.0.1:5000/api/users';

const Usuarios = {
  template: `
    <div>
      <h2>Directorio de usuarios</h2>
      <input type="text" v-model="busqueda" placeholder="Buscar por nombre...">
      <div v-if="loading">Cargando usuarios...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <table v-else>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Mas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuariosFiltrados" :key="u.id">
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td>
              <router-link :to="'/usuarios/' + u.id">
                Ver detalle
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && usuariosFiltrados.length === 0">No se encontraron usuarios.</div>
    </div>
  `,
  data() {
    return {
      usuarios: [],
      loading: true,
      error: null,
      busqueda: ''
    }
  },
  computed: {
    usuariosFiltrados() {
      const texto = this.busqueda.trim().toLowerCase();
      if (!texto) return this.usuarios;
      return this.usuarios.filter(u => u.name.toLowerCase().includes(texto));
    }
  },
  async mounted() {
    try {
      const response = await axios.get(apiUsuarios);
      this.usuarios = response.data;
    } catch (e) {
      this.error = 'No se pudieron cargar los usuarios.';
    } finally {
      this.loading = false;
    }
  }
};

const UsuarioDetalle = {
  template: `
    <div>
      <h2>Detalle de usuario</h2>
      <div v-if="loading">Cargando usuario...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <p><strong>Nombre:</strong> {{ usuario.name }}</p>
        <p><strong>Email:</strong> {{ usuario.email }}</p>
        <p><strong>Teléfono:</strong> {{ usuario.phone }}</p>
        <p><strong>Compañía:</strong> {{ usuario.company?.name }}</p>
        <button @click="volver">Volver al directorio</button>
      </div>
    </div>
  `,
  data() {
    return {
      usuario: null,
      loading: true,
      error: null
    }
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const response = await axios.get(apiUsuarios + '/' + id);
      this.usuario = response.data;
    } catch (e) {
      this.error = 'No se pudo cargar el usuario.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    volver() {
      this.$router.push('/usuarios');
    }
  }
};

const NotFound = {
  template: `
    <div style="text-align:center; margin-top:60px;">
      <img src="https://previews.123rf.com/images/vectorknight/vectorknight1711/vectorknight171100101/90815439-page-not-found-concept-404-error-web-page-with-cute-cartoon-face-flat-line-illustration-concept.jpg" alt="404" style="max-width:320px; width:100%; margin-bottom:24px;">
      <router-link to="/usuarios">
      <p> 
        <button style="margin-top:20px; padding:8px 16px;">Volver al directorio</button>
      </router-link>
    </div>
  `
};

const routes = [
  { path: '/usuarios', component: Usuarios },
  { path: '/usuarios/:id', component: UsuarioDetalle },
  { path: '/', redirect: '/usuarios' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

const app = Vue.createApp({});
app.use(router);
app.mount('#app');
