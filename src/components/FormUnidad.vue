<template>
  <form @submit.prevent="enviarFormulario" class="formulario">
    <div class="grupo">
      <label>Nombre:</label>
      <input v-model="form.nombre" required maxlength="50" @input="validarNombre" :class="{ 'border-red-500': errores.nombre }" />
      <p v-if="errores.nombre" class="error">{{ errores.nombre }}</p>
    </div>

    <div class="grupo">
      <label>Calle:</label>
      <input v-model="form.calle" required maxlength="100" />
    </div>

    <div class="grupo">
      <label>Comuna:</label>
      <input v-model="form.comuna" required maxlength="50" @input="validarComuna" :class="{ 'border-red-500': errores.comuna }" />
      <p v-if="errores.comuna" class="error">{{ errores.comuna }}</p>
    </div>

    <div class="grupo">
      <label>Región:</label>
      <input v-model="form.region" required maxlength="50" @input="validarRegion" :class="{ 'border-red-500': errores.region }" />
      <p v-if="errores.region" class="error">{{ errores.region }}</p>
    </div>

    <div class="grupo">
      <label>Teléfono:</label>
      <input v-model="form.telefono" required maxlength="12" @input="validarTelefono" :class="{ 'border-red-500': errores.telefono }" />
      <p v-if="errores.telefono" class="error">{{ errores.telefono }}</p>
    </div>

    <div class="botones">
      <button type="submit" class="btn-primary" :disabled="tieneErrores">{{ modoEdicion ? 'Actualizar' : 'Agregar' }}</button>
      <button type="button" class="btn-secondary" @click="$emit('cancelar')">Cancelar</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import type{Unidad} from '@/components/types'

const props = defineProps<{
  modoEdicion: boolean
  unidadSeleccionada: Unidad | null
}>()

const emit = defineEmits<{
  (e: 'guardado', unidad: Unidad): void
  (e: 'cancelar'): void
}>()

const form = ref<Unidad>({
  nombre: '',
  calle: '',
  comuna: '',
  region: '',
  telefono: ''
})

const errores = ref({
  nombre: '',
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

function validarNombre() {
  const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,50}$/
  errores.value.nombre = regex.test(form.value.nombre) ? '' : 'Nombre inválido (solo letras, máx. 50)'
}

function validarComuna() {
  const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,50}$/
  errores.value.comuna = regex.test(form.value.comuna) ? '' : 'Comuna inválida'
}

function validarRegion() {
  const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,50}$/
  errores.value.region = regex.test(form.value.region) ? '' : 'Región inválida'
}

function validarTelefono() {
  const regex = /^[0-9]{9,12}$/
  errores.value.telefono = regex.test(form.value.telefono)
    ? ''
    : 'Teléfono inválido (9-12 dígitos)'
}

const tieneErrores = computed(() =>
  Object.values(errores.value).some(e => e.length > 0)
)

function enviarFormulario() {
  validarNombre()
  validarComuna()
  validarRegion()
  validarTelefono()

  if (!tieneErrores.value) {
    emit('guardado', { ...form.value })
    limpiarFormulario()
  }
}

function limpiarFormulario() {
  form.value = {
    nombre: '',
    calle: '',
    comuna: '',
    region: '',
    telefono: ''
  }
  errores.value = { nombre: '', comuna: '', region: '', telefono: '' }
}
</script>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.grupo {
  display: flex;
  flex-direction: column;
}
input.border-red-500 {
  border: 2px solid red;
}
.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}
input, select {
  padding: 6px;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.botones {
  margin-top: 1rem;
}
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400;
}
</style>