<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Gestión de Enfermedades</h2>

    <FormEnfermedad
      :sintomasDisponibles="sintomas"
      :enfermedadSeleccionada="enfermedadSeleccionada"
      :modoEdicion="modoEdicion"
      @creada="guardarEnfermedad"
      @cancelar="cancelarEdicion"
    />

    <h3 class="text-xl font-semibold mt-6">Enfermedades registradas</h3>
    <table class="tabla mt-4">
      <thead>
        <tr>
          <th class="col-nombre">Nombre</th>
        <th class="col-descripcion">Descripción</th>
        <th class="col-sintomas">Síntomas</th>
        <th class="col-acciones">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="enfermedad in enfermedades" :key="enfermedad.id">
          <td>{{ enfermedad.nombre }}</td>
          <td>{{ enfermedad.descripcion }}</td>
          <td>
            <ul>
              <li
              v-for="s in enfermedad.sintomas"
              :key="s.id"
            >
              {{ obtenerNombreSintoma(s.id) }}
              </li>
            </ul>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm mr-1" @click="verDetalle(enfermedad)">Ver Detalle</button>
            <button class="btn btn-outline-primary btn-sm mr-1" @click="editarEnfermedad(enfermedad)">Editar</button>
            <button class="btn btn-outline-danger btn-sm" @click="confirmarEliminar(enfermedad.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ConfirmacionModal
      v-if="mostrarConfirmacion"
      mensaje="¿Eliminar esta enfermedad?"
      :mostrar="mostrarConfirmacion"
      @confirmar="eliminarConfirmado"
      @cancelar="mostrarConfirmacion = false"
    />

    <Alerta
      v-if="mensaje"
      :tipo="tipoMensaje"
      :mensaje="mensaje"
      :visible="!!mensaje"
      @cerrar="mensaje = ''"
    />

    <!-- Vista de detalle de enfermedad -->
    <DetalleEnfermedad
      v-if="enfermedadDetalle"
      :enfermedad="enfermedadDetalle"
      @cerrar="enfermedadDetalle = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FormEnfermedad from '@/components/FormEnfermedad.vue'
import ConfirmacionModal from '@/components/ConfirmacionModal.vue'
import Alerta from '@/components/Alerta.vue'
import DetalleEnfermedad from '@/components/DetalleEnfermedad.vue'
import {obtenerEnfermedades,crearEnfermedad,actualizarEnfermedad,eliminarEnfermedad as eliminarEnfermedadAPI,obtenerSintomas} from '@/services/api'
import type { Enfermedad, Sintoma } from '@/components/types'
import { registrarLog } from '@/services/api'

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
const nombreUsuario = usuario?.nombre ?? 'Desconocido'

const enfermedades = ref<Enfermedad[]>([])
const sintomas = ref<Sintoma[]>([])
const enfermedadSeleccionada = ref<Enfermedad | null>(null)
const enfermedadDetalle = ref<Enfermedad | null>(null)

const modoEdicion = ref(false)
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')

const mostrarConfirmacion = ref(false)
const idAEliminar = ref<number | null>(null)



async function cargarDatos() {
  try {
    enfermedades.value = await obtenerEnfermedades()
    sintomas.value = await obtenerSintomas()
  } catch (error) {
    mensaje.value = 'Error al cargar datos'
    tipoMensaje.value = 'error'
  }
}

function editarEnfermedad(enfermedad: Enfermedad) {
  enfermedadSeleccionada.value = {
    id: enfermedad.id,
    nombre: enfermedad.nombre,
    descripcion: enfermedad.descripcion ?? '',
    sintomas: enfermedad.sintomas.map(s => ({
      id: s.id,
      puntajeMaximo: s.puntajeMaximo,
      puntajeMinimo: s.puntajeMinimo ?? 0,
      valorReferencia: s.valorReferencia
    }))
  }
  modoEdicion.value = true
}

function cancelarEdicion() {
  enfermedadSeleccionada.value = null
  modoEdicion.value = false
}

function verDetalle(enfermedad: Enfermedad) {
  enfermedadDetalle.value = enfermedad
}

async function guardarEnfermedad(nueva: Enfermedad) {
  try {
    const sintomasConNombre = nueva.sintomas.map(s => {
      const sintoma = sintomas.value.find(x => x.id === s.id)
      return sintoma ? sintoma.nombre : `ID ${s.id}`
    }).join(', ')

    const dataEnfermedad = {
      nombre: nueva.nombre,
      descripcion: nueva.descripcion,
      sintomas: nueva.sintomas.map(s => ({
        id: s.id,
        puntajeMaximo: s.puntajeMaximo,
        puntajeMinimo: s.puntajeMinimo ?? 0,
        valorReferencia: s.valorReferencia
      }))
    }

    if (modoEdicion.value && enfermedadSeleccionada.value?.id !== undefined) {
      await actualizarEnfermedad(enfermedadSeleccionada.value.id, dataEnfermedad)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Actualizar Enfermedad',
        descripcion: `Se actualizó la enfermedad "${nueva.nombre}" con síntomas: ${sintomasConNombre}`
      })
      mensaje.value = 'Enfermedad actualizada correctamente'
    } else {
      await crearEnfermedad(dataEnfermedad)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Crear Enfermedad',
        descripcion: `Se creó la enfermedad "${nueva.nombre}" con síntomas: ${sintomasConNombre}`
      })
      mensaje.value = 'Enfermedad creada correctamente'
    }

    tipoMensaje.value = 'exito'
    cancelarEdicion()
    await cargarDatos()
  } catch (error) {
    mensaje.value = 'Error al guardar enfermedad'
    tipoMensaje.value = 'error'
  }
}
function confirmarEliminar(id: number | undefined) {
  if (id !== undefined) {
    idAEliminar.value = id
    mostrarConfirmacion.value = true
  }
}

async function eliminarConfirmado() {
  if (idAEliminar.value != null) {
    try {
      const enfermedad = enfermedades.value.find(e => e.id === idAEliminar.value)
      const nombresSintomas = enfermedad?.sintomas
        .map(s => {
          const sintoma = sintomas.value.find(x => x.id === s.id)
          return sintoma ? sintoma.nombre : `ID ${s.id}`
        }).join(', ') ?? 'Sin síntomas'

      await eliminarEnfermedadAPI(idAEliminar.value)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Eliminar Enfermedad',
        descripcion: `Se eliminó la enfermedad "${enfermedad?.nombre ?? 'desconocida'}" con síntomas: ${nombresSintomas}`
      })
      mensaje.value = 'Enfermedad eliminada correctamente'
      tipoMensaje.value = 'exito'
      await cargarDatos()
    } catch (error) {
      mensaje.value = 'Error al eliminar enfermedad'
      tipoMensaje.value = 'error'
    } finally {
      mostrarConfirmacion.value = false
      idAEliminar.value = null
    }
  }
}


function obtenerNombreSintoma(id: number): string {
  const sintoma = sintomas.value.find(s => s.id === id)
  return sintoma ? sintoma.nombre : `ID ${id}`
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
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
.tabla {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.tabla th,
.tabla td {
  border: 1px solid #ddd;
  padding: 8px;
  vertical-align: top;
  word-wrap: break-word;
}

.tabla th {
  background-color: #f0f0f0;
  text-align: left;
}

.col-nombre {
  width: 120px;
}
.col-descripcion {
  width: 500px;
}
.col-sintomas {
  width: 300px;
}
.col-acciones {
  width: 200px;
}
</style>
