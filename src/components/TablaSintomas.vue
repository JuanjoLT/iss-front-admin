<template>
  <div class="overflow-x-auto">
    <table class="tabla">
      <thead>
        <tr>
          <th class="col-nombre">Nombre</th>
          <th class="col-descripcion">Descripción</th>
          <th class="col-tipo">Tipo</th>
          <th class="col-min">Puntaje Minimo</th>
          <th class="col-max">Puntaje Maximo</th>
          <th class="col-ref">Valor de referencia</th>
          <th class="col-acciones">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sintoma in sintomas" :key="sintoma.id">
          <td>{{ sintoma.nombre }}</td>
          <td>{{ sintoma.descripcion }}</td>
          <td>{{ sintoma.tipo }}</td>
          <td>{{ sintoma.puntajeMinimo ?? '-' }}</td>
          <td>{{ sintoma.puntajeMaximo }}</td>
          <td>{{ sintoma.valorReferencia ?? '-' }}</td>
          <td>
            <button class="btn btn-outline-primary btn-sm mr-1" @click="$emit('editar', sintoma)">Editar</button>
            <button class="btn btn-outline-danger btn-sm" @click="$emit('eliminar', sintoma.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sintomas: {
    id: number
    nombre: string
    descripcion: string
    tipo: 'simple' | 'compuesto'
    puntajeMinimo?: number
    puntajeMaximo: number
    valorReferencia?: number
  }[]
}>()
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
  background-color: #f0f0f0;
  text-align: left;
}

.col-nombre { min-width: 120px; }
.col-descripcion { min-width: 400px; }
.col-tipo, .col-min, .col-max, .col-ref { min-width: 80px; }
.col-acciones { min-width: 160px; }

.btn {
  padding: 4px 8px;
  font-size: 0.875rem;
  border-radius: 4px;
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
