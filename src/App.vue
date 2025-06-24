<template>
  <div>
    <!-- Encabezado principal -->
    <header class="p-3 bg-primary text-white">
      <div class="container">
        <h1 class="text-center">Sistema de Gestión Médica</h1>
      </div>
    </header>

    <!-- Barra de navegación -->
    <nav class="container mt-3 d-flex flex-wrap gap-2">
      <router-link to="/" class="btn btn-outline-light">Inicio</router-link>
      <router-link to="/funcionarios" class="btn btn-outline-light">Funcionarios</router-link>
      <router-link to="/sintomas" class="btn btn-outline-light">Síntomas</router-link>
      <router-link to="/unidades" class="btn btn-outline-light">Unidades</router-link>
      <router-link to="/configuracion-semaforo" class="btn btn-outline-light">Configuración Semáforo</router-link>
      <router-link to="/historial" class="btn btn-outline-light">Historial</router-link>
    </nav>

    <!-- Renderizado de rutas -->
    <main class="container mt-4">
      <router-view />
    </main>

    <!-- Pie de página -->
    <footer class="text-center mt-5 p-3 bg-light text-muted">
      <small>&copy; 2025 Gestión Médica - Todos los derechos reservados.</small>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No necesitas lógica aquí por ahora
</script>

<style>
/* Asegúrate de que Bootstrap está funcionando, si no, verifica tu index.html */
</style>


<style scoped>
header {
  background-color: #007bff;
  color: white;
}

nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
