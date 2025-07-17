<!-- src/paginas/Profesiones.vue -->
<template>
  <div>
    <FormProfesion
      :modo-edicion="modoEdicion"
      :profesion-seleccionada="profesionSeleccionada"
      @guardado="guardarProfesion"
      @cancelar="cancelarEdicion"
    />

    <TablaProfesiones
      :profesiones="profesiones"
      @editar="editarProfesion"
      @eliminar="eliminarProfesion"
    />

    <Alerta
      v-if="mensaje"
      :mensaje="mensaje"
      :tipo="tipoMensaje"
      :visible="true"
      @cerrar="mensaje = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtenerProfesiones, crearProfesion, actualizarProfesion, eliminarProfesion as eliminarProfesionAPI } from '@/services/api'
import { registrarLog } from '@/services/api'
import FormProfesion from '@/components/FormProfesion.vue'
import TablaProfesiones from '@/components/TablaProfesiones.vue'
import Alerta from '@/components/Alerta.vue'

const profesiones = ref<{ id: number; nombre: string }[]>([])
const profesionSeleccionada = ref<{ id?: number; nombre: string } | null>(null)
const modoEdicion = ref(false)
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')

const cargarProfesiones = async () => {
  try {
    profesiones.value = await obtenerProfesiones()
  } catch {
    mensaje.value = 'Error al cargar profesiones.'
    tipoMensaje.value = 'error'
  }
}

const guardarProfesion = async (p: { id?: number; nombre: string }) => {
  try {
    if (modoEdicion.value && p.id !== undefined) {
      await actualizarProfesion(p.id, p)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: JSON.parse(localStorage.getItem('usuario') || '{}')?.nombre || 'Desconocido',
        accion: 'Actualizar Profesión',
        descripcion: `Se actualizó la profesión "${p.nombre}"`
      })
      mensaje.value = 'Profesión actualizada correctamente'
    } else {
      await crearProfesion(p)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: JSON.parse(localStorage.getItem('usuario') || '{}')?.nombre || 'Desconocido',
        accion: 'Crear Profesión',
        descripcion: `Se creó la profesión "${p.nombre}"`
      })
      mensaje.value = 'Profesión creada correctamente'
    }

    modoEdicion.value = false
    profesionSeleccionada.value = null
    tipoMensaje.value = 'exito'
    await cargarProfesiones()
  } catch {
    mensaje.value = 'Error al guardar la profesión'
    tipoMensaje.value = 'error'
  }
}

const editarProfesion = (p: { id: number; nombre: string }) => {
  profesionSeleccionada.value = { ...p }
  modoEdicion.value = true
}

const cancelarEdicion = () => {
  profesionSeleccionada.value = null
  modoEdicion.value = false
}

const eliminarProfesion = async (id: number) => {
  try {
    const p = profesiones.value.find(x => x.id === id)
    await eliminarProfesionAPI(id)
    await registrarLog({
      fecha: new Date().toISOString(),
      usuario: JSON.parse(localStorage.getItem('usuario') || '{}')?.nombre || 'Desconocido',
      accion: 'Eliminar Profesión',
      descripcion: `Se eliminó la profesión "${p?.nombre ?? 'desconocida'}"`
    })
    mensaje.value = 'Profesión eliminada correctamente'
    tipoMensaje.value = 'exito'
    await cargarProfesiones()
  } catch {
    mensaje.value = 'Error al eliminar la profesión'
    tipoMensaje.value = 'error'
  }
}

onMounted(cargarProfesiones)
</script>
