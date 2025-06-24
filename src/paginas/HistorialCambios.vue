<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Registro de Auditoría / Logs</h2>
    
    <!-- Campo de búsqueda para filtrar logs en tiempo real -->
    <input
      v-model="filtro"
      placeholder="Buscar logs..."
      class="input-busqueda mb-4"
    />

    <!-- Tabla para mostrar los registros -->
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Fecha</th>
          <th class="border p-2">Usuario</th>
          <th class="border p-2">Acción</th>
          <th class="border p-2">Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logsFiltrados" :key="log.id">
          <td class="border p-2">{{ log.id }}</td>
          <td class="border p-2">{{ log.fecha }}</td>
          <td class="border p-2">{{ log.usuario }}</td>
          <td class="border p-2">{{ log.accion }}</td>
          <td class="border p-2">{{ log.descripcion }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Mensaje si no hay logs para mostrar -->
    <p v-if="logsFiltrados.length === 0" class="text-gray-600 mt-4">
      No hay logs disponibles.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { obtenerLogs } from '@/services/api'  // Asegúrate de tener esta función en tu api.ts

// Definir la interfaz de Log para TypeScript

interface Log {
  id: number
  fecha: string
  usuario: string
  accion: 'crear' | 'editar' | 'eliminar'
  descripcion: string
}


const logs = ref<Log[]>([])
const filtro = ref('')

// Función para cargar los logs desde la API
const cargarLogs = async () => {
  try {
    logs.value = await obtenerLogs()
  } catch (error) {
    console.error('Error al cargar logs:', error)
  }
}

onMounted(() => {
  cargarLogs()
})

// Computed para filtrar los logs según el texto del filtro
const logsFiltrados = computed(() => {
  if (!filtro.value) return logs.value
  return logs.value.filter(log =>
    Object.values(log).some(value =>
      String(value).toLowerCase().includes(filtro.value.toLowerCase())
    )
  )
})
</script>

<style scoped>
.input-busqueda {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
table {
  width: 100%;
  margin-top: 1rem;
}
th {
  text-align: left;
  background-color: #f5f5f5;
}
</style>
