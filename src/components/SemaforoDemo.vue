<template>
  <div class="semaforo-demo p-4 border rounded mt-6">
    <h3 class="text-xl font-bold mb-2">Prueba de Semáforo</h3>
    <label class="block mb-1 font-semibold">Total de puntaje:</label>
    <input
      type="number"
      v-model.number="total"
      class="input mb-2"
      placeholder="Ingresa el puntaje total"
    />

    <div class="resultado">
      <p>
        El semáforo correspondiente es:
        <span :class="['label', colorClase]">{{ semaforoColor }}</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps<{
  configuracion: {
    verde: number
    amarillo: number
  }
}>()

const total = ref(0)

// Lógica para determinar el color (reglas:  
// - Verde: total menor que el umbral "verde"
// - Amarillo: total entre el umbral "verde" (inclusive) y "amarillo" (exclusivo)
// - Rojo: total mayor o igual a "amarillo"
const semaforoColor = computed(() => {
  if (total.value < props.configuracion.verde) {
    return 'Verde'
  } else if (total.value < props.configuracion.amarillo) {
    return 'Amarillo'
  } else {
    return 'Rojo'
  }
})

// Asignación de clases de estilos según el color
const colorClase = computed(() => {
  const color = semaforoColor.value.toLowerCase()
  if (color === 'verde') return 'bg-green-200 text-green-800 p-1 rounded'
  if (color === 'amarillo') return 'bg-yellow-200 text-yellow-800 p-1 rounded'
  if (color === 'rojo') return 'bg-red-200 text-red-800 p-1 rounded'
  return ''
})
</script>

<style scoped>
.input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}
.label {
  font-weight: bold;
  margin-left: 5px;
}
</style>
