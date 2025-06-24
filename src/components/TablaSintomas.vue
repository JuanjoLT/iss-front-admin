<template>
  <div class="tabla-sintomas">
    <!-- Campo de búsqueda -->
    <input v-model="filtro" placeholder="Buscar..." class="input-busqueda" />

    <!-- Tabla -->
    <table class="w-full mt-3 border-collapse">
      <thead>
        <tr>
          <th class="border p-2">Nombre</th>
          <th class="border p-2">Puntuación</th>
          <th class="border p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sintoma in sintomasFiltrados" :key="sintoma.id">
          <td class="border p-2">{{ sintoma.nombre }}</td>
          <td class="border p-2">{{ sintoma.puntuacion }}</td>
          <td class="border p-2">
            <button @click="$emit('editar', sintoma)">Editar</button>
            <button @click="$emit('eliminar', sintoma.id)">Eliminar</button>
          </td>
        </tr v-for="sintoma in sintomasFiltrados" :key="sintoma.id ?? sintoma.nombre">
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'

interface Sintoma {
  id?: number
  nombre: string
  puntuacion: number
}

const props = defineProps<{
  sintomas: Sintoma[]
}>()


const filtro = ref('')

const sintomasFiltrados = computed(() =>
  props.sintomas.filter((s) =>
    `${s.nombre} ${s.puntuacion}`.toLowerCase().includes(filtro.value.toLowerCase())
  )
)
</script>

<style scoped>
.input-busqueda {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}
</style>
