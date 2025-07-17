<!-- src/components/TablaProfesiones.vue -->
<template>
  <table class="tabla">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in profesiones" :key="p.id">
        <td>{{ p.nombre }}</td>
        <td>
          <button class="btn btn-outline-primary btn-sm mr-2" @click="$emit('editar', p)">Editar</button>
          <button class="btn btn-outline-danger btn-sm" @click="$emit('eliminar', p.id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
defineProps<{
  profesiones: { id: number; nombre: string }[]
}>()
</script>

<style scoped>
.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.tabla th,
.tabla td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.btn {
  padding: 4px 8px;
  font-size: 0.875rem;
}
.btn-outline-primary {
  background-color: #e7f1ff;
  color: #1d4ed8;
  border: 1px solid #1d4ed8;
}
.btn-outline-danger {
  background-color: #ffe7e7;
  color: #b91c1c;
  border: 1px solid #b91c1c;
}
</style>
