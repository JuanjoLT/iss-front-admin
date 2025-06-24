<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Gestión de Síntomas y Patologías</h2>

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
import {obtenerSintomas,crearSintoma,actualizarSintoma,eliminarSintoma as eliminarSintomaAPI} from '@/services/api'

interface Sintoma {
  id?: number
  nombre: string
  puntuacion: number
}

const sintomas = ref<Sintoma[]>([])
const sintomaSeleccionado = ref<Sintoma | null>(null)
const modoEdicion = ref(false)
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')

const cargarSintomas = async () => {
  try {
    sintomas.value = await obtenerSintomas()
  } catch (error) {
    tipoMensaje.value = 'error'
    mensaje.value = 'Error al cargar síntomas'
  }
}

const guardarSintoma = async (s: Sintoma) => {
  try {
    if (modoEdicion.value && s.id !== undefined) {
      await actualizarSintoma(s.id, s)
      mensaje.value = 'Síntoma actualizado correctamente'
    } else {
      await crearSintoma(s)
      mensaje.value = 'Síntoma creado correctamente'
    }
    tipoMensaje.value = 'exito'
    modoEdicion.value = false
    sintomaSeleccionado.value = null
    cargarSintomas()
  } catch (error) {
    mensaje.value = 'Error al guardar el síntoma'
    tipoMensaje.value = 'error'
  }
}

const editarSintoma = (s: Sintoma) => {
  sintomaSeleccionado.value = { ...s }
  modoEdicion.value = true
}

const cancelarEdicion = () => {
  sintomaSeleccionado.value = null
  modoEdicion.value = false
}

const eliminarSintoma = async (id: number) => {
  try {
    await eliminarSintomaAPI(id)
    mensaje.value = 'Síntoma eliminado correctamente'
    tipoMensaje.value = 'exito'
    cargarSintomas()
  } catch (error) {
    mensaje.value = 'Error al eliminar el síntoma'
    tipoMensaje.value = 'error'
  }
}


onMounted(cargarSintomas)
</script>
