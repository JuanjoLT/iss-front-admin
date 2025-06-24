<template>
  <div class="container">
    <h2 class="mt-4 mb-3">Bienvenido al Sistema de Gestión Médica</h2>
    <p>Utiliza el menú de navegación para acceder a las distintas secciones del sistema.</p>

    <div class="row mt-4">
      <div class="col-md-4" v-for="link in links" :key="link.path">
        <router-link :to="link.path" class="btn btn-outline-primary w-100 mb-3">
          {{ link.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const links = [
  { name: 'Funcionarios', path: '/funcionarios' },
  { name: 'Síntomas y Patologías', path: '/sintomas' },
  { name: 'Unidades de Referencia', path: '/unidades' },
  { name: 'Configuración del Semáforo', path: '/configuracion-semaforo' },
  { name: 'Historial de Cambios', path: '/historial' },
]
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
