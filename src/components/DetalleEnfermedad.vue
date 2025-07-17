<template>
  <div class="modal-overlay" @click.self="cerrarModal">
    <div class="modal-content">
      <h3 class="text-xl font-bold mb-2">Detalle de Enfermedad</h3>

      <p><strong>Nombre:</strong> {{ enfermedad.nombre }}</p>
      <p><strong>Descripción:</strong> {{ enfermedad.descripcion }}</p>

      <h4 class="mt-4 font-semibold">Síntomas Asociados:</h4>
      <table class="table-sintomas w-full mt-2">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>ID</th>
            <th>Puntaje Mínimo</th>
            <th>Puntaje Máximo</th>
            <th>Valor de Referencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in enfermedad.sintomas" :key="s.id">
            <td>{{ obtenerNombreSintoma(s.id) }}</td>
            <td>{{ s.id }}</td>
            <td>{{ s.puntajeMinimo ?? '-' }}</td>
            <td>{{ s.puntajeMaximo }}</td>
            <td>
              <span v-if="esCompuesto(s.id)">
                {{ s.valorReferencia ?? '-' }}
              </span>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>

      <button class="btn-cerrar mt-4" @click="cerrarModal">Cerrar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import type { Enfermedad, Sintoma } from '@/components/types'
import { obtenerSintomas } from '@/services/api'

const props = defineProps<{ enfermedad: Enfermedad }>()
const emit = defineEmits<{ (e: 'cerrar'): void }>()

const sintomasGlobales = ref<Sintoma[]>([])

onMounted(async () => {
  sintomasGlobales.value = await obtenerSintomas()

  window.addEventListener('keydown', manejarEscape)
})

onUnmounted(() => {
  window.removeEventListener('keydown', manejarEscape)
})

function manejarEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    cerrarModal()
  }
}

function obtenerNombreSintoma(id: number): string {
  return sintomasGlobales.value.find(s => s.id === id)?.nombre ?? `ID ${id}`
}

function esCompuesto(id: number): boolean {
  return sintomasGlobales.value.find(s => s.id === id)?.tipo === 'compuesto'
}

function cerrarModal() {
  emit('cerrar')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 24px;
  max-width: 700px;
  width: 90%;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow-y: auto;
}

.table-sintomas {
  width: 100%;
  border-collapse: collapse;
}

.table-sintomas th,
.table-sintomas td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.table-sintomas th {
  background-color: #f5f5f5;
}

.btn-cerrar {
  background-color: #ccc;
  padding: 8px 16px;
  border-radius: 4px;
}
</style>
