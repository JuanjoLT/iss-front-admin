<template>
  <div class="tabla-funcionarios overflow-x-auto">
    <input v-model="filtro" placeholder="Buscar..." class="input-busqueda mb-3" />

    <table class="tabla">
      <thead>
        <tr>
          <th class="col-nombre">Nombre</th>
          <th class="col-rut">RUT</th>
          <th class="col-email">Email</th>
          <th class="col-telefono">Teléfono</th>
          <th class="col-unidad">Unidad</th>
          <th class="col-profesion">Profesión</th>
          <th class="col-acciones">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="funcionario in funcionariosFiltrados" :key="funcionario.id">
          <td>{{ funcionario.nombre }}</td>
          <td>{{ funcionario.rut }}</td>
          <td>{{ funcionario.email }}</td>
          <td>{{ funcionario.telefono }}</td>
          <td>{{ funcionario.unidad }}</td>
          <td>{{ funcionario.profesion }}</td>
          <td>
            <button @click="$emit('editar', funcionario)" class="btn btn-outline-primary">Editar</button>
            <button @click="$emit('eliminar', funcionario.id)" class="btn btn-outline-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'

interface Funcionario {
  id: number
  nombre: string
  rut: string
  email: string
  telefono: string
  unidad: string
  profesion: string
}

const props = defineProps<{ funcionarios: Funcionario[] }>()
const filtro = ref('')
const paginaActual = ref(1)
const funcionariosPorPagina = 5

const funcionariosFiltrados = computed(() => {
  const filtrados = props.funcionarios.filter(f =>
    Object.values(f).join(' ').toLowerCase().includes(filtro.value.toLowerCase())
  )
  const inicio = (paginaActual.value - 1) * funcionariosPorPagina
  return filtrados.slice(inicio, inicio + funcionariosPorPagina)
})
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
  text-align: left;
}

.col-nombre { min-width: 120px; }
.col-rut { min-width: 110px; }
.col-email { min-width: 180px; }
.col-telefono { min-width: 120px; }
.col-unidad { min-width: 120px; }
.col-profesion { min-width: 130px; }
.col-acciones { min-width: 160px; }

.btn {
  padding: 4px 8px;
  font-size: 0.875rem;
  border-radius: 4px;
  margin-right: 4px;
}
.btn-outline-primary {
  background-color: #e7f1ff;
  color: #1d4ed8;
  border: 1px solid #1d4ed8;
}
.btn-outline-primary:hover {
  background-color: #cfe0ff;
}
.btn-outline-danger {
  background-color: #ffe7e7;
  color: #b91c1c;
  border: 1px solid #b91c1c;
}
.btn-outline-danger:hover {
  background-color: #ffc9c9;
}
</style>
