<template>
  <nav class="bg-gray-200 px-6 py-3 flex gap-4">
    <RouterLink to="/" class="link">Inicio</RouterLink>
    <RouterLink to="/funcionarios" class="link">Funcionarios</RouterLink>
    <RouterLink to="/sintomas" class="link">Síntomas</RouterLink>
    <RouterLink to="/unidades" class="link">Unidades</RouterLink>
    <RouterLink to="/configuracion-semaforo" class="link">Semáforo</RouterLink>
    <RouterLink to="/historial" class="link">Historial</RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.link {
  padding: 6px 10px;
  border-radius: 4px;
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
}
.link:hover {
  background-color: #d1d5db;
}
</style>
