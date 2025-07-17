<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Gestión de Profesiones</h2>

    <!-- Formulario -->
    <form @submit.prevent="enviarFormulario" class="mb-6">
      <input
        v-model="form.nombre"
        type="text"
        placeholder="Nombre de la profesión"
        required
        maxlength="50"
        class="input mb-2"
      />
      <div>
        <button type="submit" class="btn btn-outline-primary">
          {{ modoEdicion ? 'Actualizar' : 'Agregar' }}
        </button>
        <button type="button" @click="cancelar" v-if="modoEdicion" class="btn btn-outline-secondary ml-2">
          Cancelar
        </button>
      </div>
    </form>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="tabla">
        <thead>
          <tr>
            <th class="w-3/5">Nombre</th>
            <th class="w-2/5">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="profesion in profesiones" :key="profesion.id">
            <td>{{ profesion.nombre }}</td>
            <td>
              <button class="btn btn-outline-primary btn-sm mr-1" @click="editar(profesion)">Editar</button>
              <button class="btn btn-outline-danger btn-sm" @click="confirmarEliminar(profesion)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmación -->
    <ConfirmacionModal
      v-if="profesionAEliminar"
      mensaje="¿Eliminar esta profesión?"
      :mostrar="!!profesionAEliminar"
      @confirmar="eliminarConfirmado"
      @cancelar="profesionAEliminar = null"
    />

    <!-- Alerta -->
    <Alerta
      v-if="mensaje"
      :mensaje="mensaje"
      :tipo="tipoMensaje"
      :visible="!!mensaje"
      @cerrar="mensaje = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtenerProfesiones, crearProfesion, actualizarProfesion, eliminarProfesion, registrarLog } from '@/services/api'
import ConfirmacionModal from '@/components/ConfirmacionModal.vue'
import Alerta from '@/components/Alerta.vue'

interface Profesion {
  id: number
  nombre: string
}

const profesiones = ref<Profesion[]>([])
const profesionAEliminar = ref<Profesion | null>(null)
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')
const modoEdicion = ref(false)
const profesionEnEdicion = ref<Profesion | null>(null)

const form = ref({
  nombre: ''
})

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
const nombreUsuario = usuario?.nombre ?? 'Desconocido'

async function cargarProfesiones() {
  try {
    profesiones.value = await obtenerProfesiones()
  } catch {
    mensaje.value = 'Error al cargar profesiones.'
    tipoMensaje.value = 'error'
  }
}

async function enviarFormulario() {
  try {
    if (modoEdicion.value && profesionEnEdicion.value) {
      await actualizarProfesion(profesionEnEdicion.value.id, { nombre: form.value.nombre })
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Actualizar Profesión',
        descripcion: `Se actualizó la profesión "${form.value.nombre}"`
      })
      mensaje.value = 'Profesión actualizada correctamente.'
    } else {
      await crearProfesion({ nombre: form.value.nombre })
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Crear Profesión',
        descripcion: `Se creó la profesión "${form.value.nombre}"`
      })
      mensaje.value = 'Profesión agregada correctamente.'
    }
    tipoMensaje.value = 'exito'
    cancelar()
    await cargarProfesiones()
  } catch {
    mensaje.value = 'Error al guardar la profesión.'
    tipoMensaje.value = 'error'
  }
}

function editar(profesion: Profesion) {
  profesionEnEdicion.value = profesion
  form.value.nombre = profesion.nombre
  modoEdicion.value = true
}

function cancelar() {
  form.value.nombre = ''
  profesionEnEdicion.value = null
  modoEdicion.value = false
}

function confirmarEliminar(profesion: Profesion) {
  profesionAEliminar.value = profesion
}

async function eliminarConfirmado() {
  if (profesionAEliminar.value) {
    try {
      await eliminarProfesion(profesionAEliminar.value.id)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Eliminar Profesión',
        descripcion: `Se eliminó la profesión "${profesionAEliminar.value.nombre}"`
      })
      mensaje.value = 'Profesión eliminada correctamente.'
      tipoMensaje.value = 'exito'
      await cargarProfesiones()
    } catch {
      mensaje.value = 'Error al eliminar la profesión.'
      tipoMensaje.value = 'error'
    } finally {
      profesionAEliminar.value = null
    }
  }
}

onMounted(cargarProfesiones)
</script>

<style scoped>
.input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
}

.tabla {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.tabla th,
.tabla td {
  border: 1px solid #ddd;
  padding: 8px;
  word-break: break-word;
  vertical-align: top;
}

.tabla th {
  background-color: #f0f0f0;
  text-align: left;
}

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
.btn-outline-primary:hover {
  background-color: #cfe0ff;
}

.btn-outline-danger {
  background-color: #ffe7e7;
  color: #b91c1c;
  border: 1px solid #b91c1c;
}
.btn-outline-danger:hover {
  background-color: #ffc9c9;
}

.btn-outline-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #aaa;
}
.btn-outline-secondary:hover {
  background-color: #e0e0e0;
}
</style>
