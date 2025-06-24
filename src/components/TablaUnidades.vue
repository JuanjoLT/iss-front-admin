<template>
  <div class="tabla-unidades">
    <input v-model="filtro" placeholder="Buscar..." class="input-busqueda" />

    <table class="w-full mt-3 border-collapse">
      <thead>
        <tr>
          <th class="border p-2">Nombre</th>
          <th class="border p-2">Calle</th>
          <th class="border p-2">Comuna</th>
          <th class="border p-2">Región</th>
          <th class="border p-2">Teléfono</th>
          <th class="border p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unidad in unidadesFiltradas" :key="unidad.id ?? unidad.nombre">
          <td class="border p-2">{{ unidad.nombre }}</td>
          <td class="border p-2">{{ unidad.calle }}</td>
          <td class="border p-2">{{ unidad.comuna }}</td>
          <td class="border p-2">{{ unidad.region }}</td>
          <td class="border p-2">{{ unidad.telefono }}</td>
          <td class="border p-2">
            <button @click="$emit('editar', unidad)">Editar</button>
            <button @click="$emit('eliminar', unidad.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'

interface Unidad {
  id?: number
  nombre: string
  calle: string
  comuna: string
  region: string
  telefono: string
}

const props = defineProps<{
  unidades: Unidad[]
}>()

const filtro = ref('')

const unidadesFiltradas = computed(() =>
  props.unidades.filter((u) =>
    Object.values(u)
      .join(' ')
      .toLowerCase()
      .includes(filtro.value.toLowerCase())
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
