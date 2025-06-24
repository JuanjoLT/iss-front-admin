<template>
  <form @submit.prevent="enviarFormulario">
    <label>Nombre:</label>
    <input v-model="form.nombre" required />

    <label>Calle:</label>
    <input v-model="form.calle" required />

    <label>Comuna:</label>
    <input v-model="form.comuna" required />

    <label>Región:</label>
    <input v-model="form.region" required />

    <label>Teléfono:</label>
    <input v-model="form.telefono" required pattern="^[0-9]{9,12}$" />

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
  unidadSeleccionada: {
    id?: number
    nombre: string
    calle: string
    comuna: string
    region: string
    telefono: string
  } | null
}>()

const emit = defineEmits<{
  (e: 'guardado', unidad: typeof form.value): void
  (e: 'cancelar'): void
}>()

const form = ref<{
  id?: number
  nombre: string
  calle: string
  comuna: string
  region: string
  telefono: string
}>({
  id: undefined,
  nombre: '',
  calle: '',
  comuna: '',
  region: '',
  telefono: ''
})

watch(
  () => props.unidadSeleccionada,
  (nueva) => {
    if (nueva) {
      form.value = { ...nueva }
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
    calle: '',
    comuna: '',
    region: '',
    telefono: ''
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
