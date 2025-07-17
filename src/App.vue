<template>
  <div>
    <!-- Encabezado principal en azul (no se muestra en registro) -->
    <header v-if="mostrarLayout" class="bg-primary text-white py-4 position-relative">
      <div class="container d-flex justify-content-between align-items-center">
        <h1 class="text-center m-0 flex-grow-1">Sistema de Gestión Médica</h1>

        <!-- Menú del usuario -->
        <div class="usuario-toggle position-relative" @click.stop="toggleMenu">
          <button class="btn btn-light btn-sm">
            {{ nombreCorto }}
          </button>
          <div
            v-if="menuAbierto"
            class="usuario-menu position-absolute end-0 mt-2 bg-white text-black border rounded shadow-sm"
            style="z-index: 1000; min-width: 160px"
          >
            <a href="#" class="dropdown-item px-3 py-2 d-block text-decoration-none text-dark" @click.prevent>
              Cuenta
            </a>
            <a href="#" class="dropdown-item px-3 py-2 d-block text-decoration-none text-dark" @click.prevent="cerrarSesion">
              Cerrar sesión
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Segunda franja celeste con botones distribuidos -->
    <div v-if="mostrarLayout" class="menu-bar py-3">
      <div class="container">
        <div class="row g-3">
          <div
            class="col-12 col-sm-6 col-md-4 col-lg-2"
            v-for="link in links"
            :key="link.path"
          >
            <router-link :to="link.path" class="btn btn-outline-primary w-100">
              {{ link.name }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Submenú para síntomas -->
    <div v-if="mostrarLayout && esRutaSintomas" class="submenu bg-light py-2 border-bottom">
      <div class="container d-flex gap-3">
        <router-link
          to="/sintomas"
          class="btn btn-sm btn-outline-secondary"
          active-class="active"
        >
          Gestionar Síntomas
        </router-link>
        <router-link
          to="/sintomas/enfermedades"
          class="btn btn-sm btn-outline-secondary"
          active-class="active"
        >
          Gestionar Enfermedades
        </router-link>
      </div>
    </div>

    <!-- Submenú para funcionarios -->
    <div v-if="mostrarLayout && esRutaFuncionarios" class="submenu bg-light py-2 border-bottom">
      <div class="container d-flex gap-3">
        <router-link
          to="/funcionarios"
          class="btn btn-sm btn-outline-secondary"
          active-class="active"
        >
          Gestionar Funcionarios
        </router-link>
        <router-link
          to="/funcionarios/profesiones"
          class="btn btn-sm btn-outline-secondary"
          active-class="active"
        >
          Gestionar Profesiones
        </router-link>
      </div>
    </div>

    <!-- Contenido principal -->
    <main class="container mt-4">
      <router-view />
    </main>

    <!-- Pie de página -->
    <footer v-if="mostrarLayout" class="text-center mt-5 p-3 bg-light text-muted">
      <small>&copy; 2025 Gestión Médica - Todos los derechos reservados.</small>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuarios'

const route = useRoute()
const router = useRouter()
const usuarioStore = useUsuarioStore()

const menuAbierto = ref(false)

const mostrarLayout = computed(() => route.path !== '/')

const esRutaSintomas = computed(() =>
  ['/sintomas', '/sintomas/enfermedades'].includes(route.path)
)

const esRutaFuncionarios = computed(() =>
  ['/funcionarios', '/funcionarios/profesiones'].includes(route.path)
)

onMounted(() => {
  usuarioStore.cargarDesdeStorage()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const usuario = computed(() => usuarioStore.usuario)

const nombreCorto = computed(() => {
  const nombreCompleto = usuario.value?.nombre ?? ''
  return nombreCompleto.split(' ')[0]
})

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}

function handleClickOutside(event: MouseEvent) {
  const menu = document.querySelector('.usuario-menu')
  const toggle = document.querySelector('.usuario-toggle')

  if (
    menuAbierto.value &&
    menu &&
    toggle &&
    !menu.contains(event.target as Node) &&
    !toggle.contains(event.target as Node)
  ) {
    menuAbierto.value = false
  }
}

const cerrarSesion = () => {
  usuarioStore.cerrarSesion()
  router.push('/')
}

const links = [
  { name: 'Inicio', path: '/home' },
  { name: 'Funcionarios', path: '/funcionarios' },
  { name: 'Síntomas', path: '/sintomas' },
  { name: 'Unidades', path: '/unidades' },
  { name: 'Configuración Semáforo', path: '/configuracion-semaforo' },
  { name: 'Historial', path: '/historial' }
]
</script>

<style scoped>
.menu-bar {
  background-color: #d0ecff;
  border-bottom: 1px solid #a6d3f5;
}

.menu-bar a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.submenu {
  background-color: #f8f9fa;
  padding: 8px 16px;
  border-bottom: 1px solid #dee2e6;
}

.submenu .active {
  font-weight: bold;
  text-decoration: underline;
}

.usuario-toggle {
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
