<template>
  <div class="tabla-funcionarios">
    <!-- Campo de búsqueda -->
    <input v-model="filtro" placeholder="Buscar..." class="input-busqueda" />

    <!-- Tabla con paginación -->
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>RUT</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Unidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="funcionario in funcionariosFiltrados" :key="funcionario.rut">
          <td>{{ funcionario.nombre }}</td>
          <td>{{ funcionario.rut }}</td>
          <td>{{ funcionario.email }}</td>
          <td>{{ funcionario.telefono }}</td>
          <td>{{ funcionario.unidad }}</td>
          <td>
            <button @click="$emit('editar', funcionario)">Editar</button>
            <button @click="$emit('eliminar', funcionario)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Controles de paginación -->
    <div class="paginacion">
      <button @click="paginaActual--" :disabled="paginaActual === 1">Anterior</button>
      <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <button @click="paginaActual++" :disabled="paginaActual >= totalPaginas">Siguiente</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps<{
  funcionarios: {
    nombre: string
    rut: string
    email: string
    telefono: string
    unidad: string
  }[]
}>()

const filtro = ref('')
const paginaActual = ref(1)
const funcionariosPorPagina = 5 // 🔧 Número de funcionarios por página

// 🔎 Filtrado en tiempo real
const funcionariosFiltrados = computed(() => {
  const filtrados = props.funcionarios.filter(funcionario =>
    Object.values(funcionario).join(' ').toLowerCase().includes(filtro.value.toLowerCase())
  )

  // Aplicar paginación
  const inicio = (paginaActual.value - 1) * funcionariosPorPagina
  return filtrados.slice(inicio, inicio + funcionariosPorPagina)
})

// 🔄 Total de páginas
const totalPaginas = computed(() => Math.ceil(props.funcionarios.length / funcionariosPorPagina))
</script>

<style scoped>
.input-busqueda {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.paginacion {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
