<template>
  <form @submit.prevent="enviarFormulario">
    <label>Nombre del síntoma:</label>
    <input v-model="form.nombre" required />

    <label>Puntuación:</label>
    <input v-model.number="form.puntuacion" type="number" required min="1" />

    <div class="mt-4">
      <button type="submit" class="btn-primary">
        {{ modoEdicion ? 'Actualizar' : 'Agregar' }}
      </button>
      <button type="button" class="btn-secondary ml-2" @click="$emit('cancelar')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modoEdicion: boolean
  sintomaSeleccionado: {
    id?: number
    nombre: string
    puntuacion: number
  } | null
}>()

const emit = defineEmits<{
  (e: 'guardado', sintoma: { id?: number; nombre: string; puntuacion: number }): void
  (e: 'cancelar'): void
}>()

const form = ref<{
  id?: number
  nombre: string
  puntuacion: number
}>({
  id: undefined,
  nombre: '',
  puntuacion: 1
})


watch(
  () => props.sintomaSeleccionado,
  (nuevo) => {
    if (nuevo) {
      form.value = { ...nuevo }
    } else {
      limpiarFormulario()
    }
  },
  { immediate: true }
)


function enviarFormulario() {
  emit('guardado', { ...form.value })
  limpiarFormulario()
}

function limpiarFormulario() {
  form.value = {
    id: undefined,
    nombre: '',
    puntuacion: 1
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400;
}
</style>
