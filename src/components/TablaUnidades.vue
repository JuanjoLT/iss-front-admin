<template>
  <div class="overflow-x-auto">
    <table class="tabla">
      <thead>
        <tr>
          <th class="col-nombre">Nombre</th>
          <th class="col-calle">Calle</th>
          <th class="col-comuna">Comuna</th>
          <th class="col-region">Región</th>
          <th class="col-telefono">Teléfono</th>
          <th class="col-acciones">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unidad in unidadesFiltradas" :key="unidad.id">
          <td>{{ unidad.nombre }}</td>
          <td>{{ unidad.calle }}</td>
          <td>{{ unidad.comuna }}</td>
          <td>{{ unidad.region }}</td>
          <td>{{ unidad.telefono }}</td>
          <td>
            <button @click="$emit('editar', unidad)" class="btn btn-outline-primary">Editar</button>
            <button @click="$emit('eliminar', unidad.id)" class="btn btn-outline-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'

interface Unidad {
  id: number
  nombre: string
  calle: string
  comuna: string
  region: string
  telefono: string
}
const props = defineProps<{ unidades: Unidad[] }>()
const filtro = ref('')

const unidadesFiltradas = computed(() =>
  props.unidades.filter((u) =>
    Object.values(u).join(' ').toLowerCase().includes(filtro.value.toLowerCase())
  )
)
</script>

<style scoped>
.tabla {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  word-wrap: break-word;
  vertical-align: top;
}
th {
  background-color: #f5f5f5;
}

.col-nombre,
.col-calle,
.col-comuna,
.col-region,
.col-telefono {
  min-width: 150px;
}
.col-acciones {
  min-width: 160px;
}

.btn {
  padding: 4px 8px;
  font-size: 0.875rem;
  border-radius: 4px;
  margin-right: 4px;
}
</style>
