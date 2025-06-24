<template>
  <form @submit.prevent="manejarEnvio">
    <label>Nombre:</label>
    <input v-model="form.nombre" required />

    <label>RUT:</label>
    <input v-model="form.rut" @input="validarRut" required />
    <p v-if="errores.rut" class="error">{{ errores.rut }}</p>

    <label>Email:</label>
    <input v-model="form.email" @input="validarEmail" type="email" required />
    <p v-if="errores.email" class="error">{{ errores.email }}</p>

    <label>Teléfono:</label>
    <input v-model="form.telefono" @input="validarTelefono" required />
    <p v-if="errores.telefono" class="error">{{ errores.telefono }}</p>

    <label>Unidad de Referencia:</label>
    <select v-model="form.unidad" required>
      <option disabled value="">Selecciona una unidad</option>
      <option v-for="unidad in unidades" :key="unidad" :value="unidad">
        {{ unidad }}
      </option>
    </select>

    <div class="mt-4">
      <button type="submit" class="btn-primary" :disabled="tieneErrores">
        {{ modoEdicion ? 'Actualizar' : 'Crear' }}
      </button>
      <button type="button" class="btn-secondary ml-2" @click="$emit('cancelar')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modoEdicion: boolean
  funcionarioSeleccionado: {
    id?: number
    nombre: string
    rut: string
    email: string
    telefono: string
    unidad: string
  } | null
}>()

const emit = defineEmits<{
  (e: 'guardado', funcionario: typeof form.value): void
  (e: 'cancelar'): void
}>()

const unidades = ['Hospital A', 'Clínica B', 'CESFAM C']

const form = ref({
  id: undefined,
  nombre: '',
  rut: '',
  email: '',
  telefono: '',
  unidad: ''
})

const errores = ref({
  rut: '',
  email: '',
  telefono: ''
})

// Si recibimos un funcionario seleccionado, lo cargamos al formulario
watch(
  () => props.funcionarioSeleccionado,
  (nuevo) => {
    if (nuevo) {
      const { id, ...resto } = nuevo
      Object.assign(form.value, resto)
    } else {
      limpiarFormulario()
    }
  },
  { immediate: true }
)

// 🔧 Validaciones de formulario
function validarRut() {
  const regexRut = /^[0-9]{7,8}-[0-9Kk]$/ // Formato RUT chileno
  errores.value.rut = regexRut.test(form.value.rut) ? '' : 'RUT inválido'
}

function validarEmail() {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errores.value.email = regexEmail.test(form.value.email) ? '' : 'Email inválido'
}

function validarTelefono() {
  const regexTelefono = /^[0-9]{9,12}$/
  errores.value.telefono = regexTelefono.test(form.value.telefono) ? '' : 'Teléfono inválido'
}

const tieneErrores = computed(() => !!errores.value.rut || !!errores.value.email || !!errores.value.telefono)

function manejarEnvio() {
  if (!tieneErrores.value) {
    emit('guardado', { ...form.value })
    limpiarFormulario()
  }
}

function limpiarFormulario() {
  form.value = {
    id: undefined,
    nombre: '',
    rut: '',
    email: '',
    telefono: '',
    unidad: ''
  }
  errores.value = { rut: '', email: '', telefono: '' } // 🔧 Reset de errores
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400;
}
</style>
