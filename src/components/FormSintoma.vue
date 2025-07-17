<template>
  <form @submit.prevent="enviarFormulario" class="formulario">
    <div class="grupo">
      <label>Nombre del síntoma:</label>
      <input v-model="form.nombre" required maxlength="50" pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$" />
    </div>

    <div class="grupo">
      <label>Descripción:</label>
      <textarea v-model="form.descripcion" rows="2" maxlength="200" placeholder="Describe brevemente el síntoma" />
    </div>

    <div class="grupo">
      <label>Tipo de síntoma:</label>
      <select v-model="form.tipo" required>
        <option disabled value="">Seleccione un tipo</option>
        <option value="simple">Simple</option>
        <option value="compuesto">Compuesto</option>
      </select>
    </div>

    <div class="grupo">
      <label>Puntaje máximo:</label>
      <input v-model.number="form.puntajeMaximo" type="number" required min="1" />
    </div>

    <div v-if="form.tipo === 'compuesto'" class="grupo-compuesto">
      <div class="grupo">
        <label>Puntaje mínimo:</label>
        <input v-model.number="form.puntajeMinimo" type="number" required min="0" />
      </div>
      <div class="grupo">
        <label>Valor de referencia:</label>
        <input v-model.number="form.valorReferencia" type="number" required min="0" step="any" />
      </div>
    </div>

    <div class="botones">
      <button type="submit" class="btn-primary">
        {{ modoEdicion ? 'Actualizar' : 'Agregar' }}
      </button>
      <button type="button" class="btn-secondary" @click="$emit('cancelar')">Cancelar</button>
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
    descripcion: string
    tipo: 'simple' | 'compuesto'
    puntajeMaximo: number
    puntajeMinimo?: number
    valorReferencia?: number
  } | null
}>()

const emit = defineEmits<{
  (e: 'guardado', sintoma: typeof form.value): void
  (e: 'cancelar'): void
}>()

const form = ref<{
  id?: number
  nombre: string
  descripcion: string
  tipo: 'simple' | 'compuesto' | ''
  puntajeMaximo: number
  puntajeMinimo?: number
  valorReferencia?: number
}>({
  nombre: '',
  descripcion: '',
  tipo: '',
  puntajeMaximo: 1
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
    descripcion: '',
    tipo: '',
    puntajeMaximo: 1,
    puntajeMinimo: undefined,
    valorReferencia: undefined
  }
}
</script>

<style scoped>
input,
select,
textarea {
  display: block;
  margin-bottom: 10px;
  padding: 6px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-descripcion {
  resize: vertical;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400;
}
</style>
