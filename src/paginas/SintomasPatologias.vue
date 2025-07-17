<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Gestión de Síntomas</h2>
    <FormSintoma
      :modo-edicion="modoEdicion"
      :sintomaSeleccionado="sintomaSeleccionado"
      @guardado="guardarSintoma"
      @cancelar="cancelarEdicion"
    />

    <TablaSintomas
      :sintomas="sintomas"
      @editar="editarSintoma"
      @eliminar="eliminarSintoma"
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
import FormSintoma from '@/components/FormSintoma.vue'
import TablaSintomas from '@/components/TablaSintomas.vue'
import Alerta from '@/components/Alerta.vue'
import { obtenerSintomas, crearSintoma, actualizarSintoma, eliminarSintoma as eliminarSintomaAPI, registrarLog } from '@/services/api'
import type { Sintoma } from '@/components/types'

const sintomas = ref<Sintoma[]>([])
const sintomaSeleccionado = ref<Sintoma | null>(null)
const modoEdicion = ref(false)
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')

// Obtener usuario actual desde localStorage
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
const nombreUsuario = usuario?.nombre ?? 'Desconocido'

const cargarSintomas = async () => {
  try {
    const data = await obtenerSintomas()
    sintomas.value = data
  } catch (error) {
    tipoMensaje.value = 'error'
    mensaje.value = 'Error al cargar los síntomas.'
    console.error(error)
  }
}

const guardarSintoma = async (s: Omit<Sintoma, 'id'> & { id?: number }) => {
  try {
    if (modoEdicion.value && s.id !== undefined) {
      await actualizarSintoma(s.id, s)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Actualizar Síntoma',
        descripcion: `Se actualizó el síntoma "${s.nombre}"`
      })
      mensaje.value = 'Síntoma actualizado correctamente'
    } else {
      await crearSintoma(s)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Crear Síntoma',
        descripcion: `Se creó el síntoma "${s.nombre}"`
      })
      mensaje.value = 'Síntoma creado correctamente'
    }
    tipoMensaje.value = 'exito'
    modoEdicion.value = false
    sintomaSeleccionado.value = null
    await cargarSintomas()
  } catch (error) {
    mensaje.value = 'Error al guardar el síntoma'
    tipoMensaje.value = 'error'
  }
}

const editarSintoma = (s: Sintoma) => {
  sintomaSeleccionado.value = {
    ...s,
    descripcion: s.descripcion ?? ''
  }
  modoEdicion.value = true
}

const cancelarEdicion = () => {
  sintomaSeleccionado.value = null
  modoEdicion.value = false
}

const eliminarSintoma = async (id: number) => {
  try {
    const sintomaEliminado = sintomas.value.find(s => s.id === id)
    await eliminarSintomaAPI(id)
    await registrarLog({
      fecha: new Date().toISOString(),
      usuario: nombreUsuario,
      accion: 'Eliminar Síntoma',
      descripcion: `Se eliminó el síntoma "${sintomaEliminado?.nombre ?? 'desconocido'}"`
    })
    mensaje.value = 'Síntoma eliminado correctamente'
    tipoMensaje.value = 'exito'
    await cargarSintomas()
  } catch (error) {
    mensaje.value = 'Error al eliminar el síntoma'
    tipoMensaje.value = 'error'
  }
}

onMounted(cargarSintomas)
</script>