<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Crear Nueva Enfermedad</h2>

    <FormEnfermedad
      :sintomasDisponibles="sintomas"
      :enfermedadSeleccionada="null"
      :modoEdicion="false"
      @creada="guardarEnfermedad"
    />

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
import FormEnfermedad from '@/components/FormEnfermedad.vue'
import Alerta from '@/components/Alerta.vue'
import { obtenerSintomas, crearEnfermedad, registrarLog } from '@/services/api'
import type { Sintoma, Enfermedad } from '@/components/types'

const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
const nombreUsuario = usuario?.nombre ?? 'Desconocido'

const sintomas = ref<Sintoma[]>([])
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')

const cargarSintomas = async () => {
  try {
    const datos = await obtenerSintomas()
    sintomas.value = datos.map((s: Sintoma) => ({
      id: s.id ?? -1,
      nombre: s.nombre,
      tipo: s.tipo
    }))
  } catch (error) {
    mensaje.value = 'Error al cargar síntomas'
    tipoMensaje.value = 'error'
  }
}

const guardarEnfermedad = async (enfermedad: Enfermedad) => {
  try {
    const enfermedadFormateada = {
      nombre: enfermedad.nombre,
      descripcion: enfermedad.descripcion,
      sintomas: enfermedad.sintomas.map(s => ({
        id: s.id,
        puntajeMaximo: s.puntajeMaximo,
        puntajeMinimo: s.puntajeMinimo ?? 0,
        valorReferencia: s.valorReferencia
      }))
    }

    await crearEnfermedad(enfermedadFormateada)

    await registrarLog({
      fecha: new Date().toISOString(),
      usuario: nombreUsuario,
      accion: 'Crear Enfermedad',
      descripcion: `Se creó la enfermedad "${enfermedad.nombre}"`
    })

    mensaje.value = 'Enfermedad guardada correctamente'
    tipoMensaje.value = 'exito'
  } catch (error) {
    mensaje.value = 'Error al guardar la enfermedad'
    tipoMensaje.value = 'error'
  }
}

onMounted(cargarSintomas)
</script>
