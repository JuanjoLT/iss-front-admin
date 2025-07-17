<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Configuración del Semáforo</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block mb-1 font-semibold">Valor mínimo verde:</label>
        <input v-model.number="configuracion.verde" type="number" class="input" />
      </div>

      <div>
        <label class="block mb-1 font-semibold">Valor máximo amarillo:</label>
        <input v-model.number="configuracion.amarillo" type="number" class="input" />
      </div>
    </div>

    <button @click="guardarConfiguracion" class="btn-primary">Guardar configuración</button>

    <Alerta v-if="mensaje" :visible="true" :tipo="tipoMensaje" :mensaje="mensaje" @cerrar="mensaje = ''"/>


    <!-- Integración del componente demo del semáforo -->
    <SemaforoDemo :configuracion="configuracion" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { obtenerConfiguracion, actualizarConfiguracion } from '@/services/api'
import Alerta from '@/components/Alerta.vue'
import SemaforoDemo from '@/components/SemaforoDemo.vue'
import type { ConfiguracionSemaforo } from '@/components/types'

const configuracion = ref<ConfiguracionSemaforo>({ verde: 0, amarillo: 0 })
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')

onMounted(async () => {
  try {
    const data = await obtenerConfiguracion()
    configuracion.value = data
  } catch (error) {
    mensaje.value = 'Error al cargar configuración'
    tipoMensaje.value = 'error'
  }
})

async function guardarConfiguracion() {
  try {
    await actualizarConfiguracion(configuracion.value)
    mensaje.value = 'Configuración guardada correctamente'
    tipoMensaje.value = 'exito'
  } catch (error) {
    mensaje.value = 'Error al guardar configuración'
    tipoMensaje.value = 'error'
  }
}
</script>

<style scoped>
.input {
  @apply w-full border rounded px-3 py-2 shadow-sm;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
</style>
