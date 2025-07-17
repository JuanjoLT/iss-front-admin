<template>
  <form @submit.prevent="manejarEnvio">
    <div class="flex flex-wrap gap-y-4">
      <div class="me-4" style="min-width: 200px">
        <label>Nombre:</label>
        <input
          v-model="form.nombre"
          required
          maxlength="50"
          @input="validarNombre"
          :class="{ 'border-red-500': errores.nombre }"
          class="w-full"
        />
        <p v-if="errores.nombre" class="error">{{ errores.nombre }}</p>
      </div>

      <div class="me-4" style="min-width: 150px">
        <label>RUT:</label>
        <input
          v-model="form.rut"
          @input="validarRut"
          required
          maxlength="10"
          :class="{ 'border-red-500': errores.rut }"
          class="w-full"
        />
        <p v-if="errores.rut" class="error">{{ errores.rut }}</p>
      </div>

      <div class="me-4" style="min-width: 220px">
        <label>Email:</label>
        <input
          v-model="form.email"
          @input="validarEmail"
          type="email"
          required
          maxlength="100"
          :class="{ 'border-red-500': errores.email }"
          class="w-full"
        />
        <p v-if="errores.email" class="error">{{ errores.email }}</p>
      </div>

      <div class="me-4" style="min-width: 160px">
        <label>Teléfono:</label>
        <input
          v-model="form.telefono"
          @input="validarTelefono"
          required
          maxlength="12"
          :class="{ 'border-red-500': errores.telefono }"
          class="w-full"
        />
        <p v-if="errores.telefono" class="error">{{ errores.telefono }}</p>
      </div>

      <div class="me-4" style="min-width: 200px">
        <label>Unidad de Referencia:</label>
        <select v-model="form.unidad" required class="w-full">
          <option disabled value="">Selecciona una unidad</option>
          <option v-for="unidad in unidades" :key="unidad" :value="unidad">
            {{ unidad }}
          </option>
        </select>
      </div>

      <div style="min-width: 200px">
        <label>Profesión:</label>
        <select v-model="form.profesion" required class="w-full">
          <option disabled value="">Selecciona una profesión</option>
          <option v-for="profesion in profesiones" :key="profesion" :value="profesion">
            {{ profesion }}
          </option>
        </select>
      </div>
    </div>

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

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits, onMounted } from 'vue'
import { obtenerUnidades, obtenerProfesiones } from '@/services/api'
import type { Funcionario } from '@/components/types'

const props = defineProps<{
  modoEdicion: boolean
  funcionarioSeleccionado: Funcionario | null
}>()

const emit = defineEmits<{
  (e: 'guardado', funcionario: Funcionario): void
  (e: 'cancelar'): void
}>()

const unidades = ref<string[]>([])
const profesiones = ref<string[]>([])

onMounted(async () => {
  try {
    const datosUnidades = await obtenerUnidades()
    unidades.value = datosUnidades.map((u: any) => u.nombre)

    const datosProfesiones = await obtenerProfesiones()
    profesiones.value = datosProfesiones.map((p: any) => p.nombre)
  } catch (error) {
    console.error('Error al cargar unidades o profesiones:', error)
  }
})

const form = ref<Funcionario>({
  id: undefined,
  nombre: '',
  rut: '',
  email: '',
  telefono: '',
  unidad: '',
  profesion: ''
})

const errores = ref({
  nombre: '',
  rut: '',
  email: '',
  telefono: ''
})

// Validaciones individuales
function validarNombre() {
  const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/
  errores.value.nombre =
    form.value.nombre.length > 50
      ? 'Máximo 50 caracteres'
      : regexNombre.test(form.value.nombre)
      ? ''
      : 'Nombre inválido (solo letras y espacios)'
}

function validarRut() {
  const regexRut = /^[0-9]{7,8}-[0-9Kk]$/
  errores.value.rut = regexRut.test(form.value.rut) ? '' : 'RUT inválido'
}

function validarEmail() {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errores.value.email = regexEmail.test(form.value.email) ? '' : 'Email inválido'
}

function validarTelefono() {
  const regexTelefono = /^[0-9]{9,12}$/
  errores.value.telefono = regexTelefono.test(form.value.telefono)
    ? ''
    : 'Teléfono inválido (9-12 dígitos)'
}

const tieneErrores = computed(() =>
  Object.values(errores.value).some(e => e.length > 0)
)

watch(
  () => props.funcionarioSeleccionado,
  (nuevo) => {
    if (nuevo) {
      form.value = { ...nuevo }
    } else {
      limpiarFormulario()
    }
  },
  { immediate: true }
)

function manejarEnvio() {
  validarNombre()
  validarRut()
  validarEmail()
  validarTelefono()
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
    unidad: '',
    profesion: ''
  }
  errores.value = { nombre: '', rut: '', email: '', telefono: '' }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}
input:invalid,
input.border-red-500 {
  border: 2px solid red;
}
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400;
}
</style>
