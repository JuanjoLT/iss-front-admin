<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Gestión de Unidades de Referencia</h2>

    <!-- Formulario -->
    <FormUnidad
      :modo-edicion="modoEdicion"
      :unidadSeleccionada="unidadSeleccionada"
      @guardado="guardarUnidad"
      @cancelar="cancelarEdicion"
    />

    <!-- Tabla -->
    <TablaUnidades
      :unidades="unidades"
      @editar="editarUnidad"
      @eliminar="eliminarUnidad"
    />

    <!-- Alerta -->
    <Alerta
      v-if="mensaje"
      :tipo="tipoMensaje"
      :mensaje="mensaje"
      :visible="!!mensaje"
      @cerrar="mensaje = ''"
    />

    <!-- Modal de confirmación -->
    <ConfirmacionModal
      v-if="mostrarConfirmacion"
      mensaje="¿Eliminar esta unidad de referencia?"
      :mostrar="mostrarConfirmacion"
      @confirmar="confirmarEliminacion"
      @cancelar="mostrarConfirmacion = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FormUnidad from '@/components/FormUnidad.vue'
import TablaUnidades from '@/components/TablaUnidades.vue'
import Alerta from '@/components/Alerta.vue'
import ConfirmacionModal from '@/components/ConfirmacionModal.vue'
import {obtenerUnidades,crearUnidad,actualizarUnidad,eliminarUnidad as eliminarUnidadAPI} from '@/services/api'
import { registrarLog } from '@/services/api'

interface Unidad {
  id?: number
  nombre: string
  calle: string
  comuna: string
  region: string
  telefono: string
}

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
const nombreUsuario = usuario?.nombre ?? 'Desconocido'
const unidades = ref<Unidad[]>([])
const unidadSeleccionada = ref<Unidad | null>(null)
const modoEdicion = ref(false)
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')
const mostrarConfirmacion = ref(false)
const idAEliminar = ref<number | null>(null)

const cargarUnidades = async () => {
  try {
    unidades.value = await obtenerUnidades()
  } catch {
    mensaje.value = 'Error al cargar unidades'
    tipoMensaje.value = 'error'
  }
}

const guardarUnidad = async (unidad: Unidad) => {
  try {
    if (unidad.id != null) {
      await actualizarUnidad(unidad.id, unidad)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Actualizar Unidad',
        descripcion: `Se actualizó la unidad "${unidad.nombre}"`
      })
      mensaje.value = 'Unidad actualizada correctamente'
    } else {
      await crearUnidad(unidad)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Crear Unidad',
        descripcion: `Se creó la unidad "${unidad.nombre}"`
      })
      mensaje.value = 'Unidad creada correctamente'
    }

    tipoMensaje.value = 'exito'
    await cargarUnidades()
    cancelarEdicion()
  } catch {
    mensaje.value = 'Error al guardar unidad'
    tipoMensaje.value = 'error'
  }
}


const editarUnidad = (unidad: Unidad) => {
  unidadSeleccionada.value = unidad
  modoEdicion.value = true
}

const cancelarEdicion = () => {
  unidadSeleccionada.value = null
  modoEdicion.value = false
}

const eliminarUnidad = (id: number) => {
  idAEliminar.value = id
  mostrarConfirmacion.value = true
}

const confirmarEliminacion = async () => {
  if (idAEliminar.value != null) {
    try {
      const unidadEliminada = unidades.value.find(u => u.id === idAEliminar.value)
      await eliminarUnidadAPI(idAEliminar.value)

      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Eliminar Unidad',
        descripcion: `Se eliminó la unidad "${unidadEliminada?.nombre ?? 'desconocida'}"`
      })

      mensaje.value = 'Unidad eliminada correctamente'
      tipoMensaje.value = 'exito'
      await cargarUnidades()
    } catch {
      mensaje.value = 'Error al eliminar unidad'
      tipoMensaje.value = 'error'
    } finally {
      mostrarConfirmacion.value = false
      idAEliminar.value = null
    }
  }
}


onMounted(cargarUnidades)
</script>
