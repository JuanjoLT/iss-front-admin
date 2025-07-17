<template>
  <form @submit.prevent="enviarFormulario">
    <label>Nombre de la enfermedad:</label>
    <input v-model="form.nombre" required maxlength="50" />

    <label>Descripción:</label>
    <textarea
      v-model="form.descripcion"
      rows="2"
      maxlength="300"
      class="input-descripcion"
      placeholder="Descripción de la enfermedad"
    ></textarea>

    <h3 class="mt-4 font-bold">Agregar Síntomas</h3>
    <div class="flex items-center gap-4 mb-4">
      <select v-model="sintomaSeleccionadoId">
        <option disabled value="">Seleccione un síntoma</option>
        <option
          v-for="s in sintomasDisponiblesFiltrados"
          :key="s.id"
          :value="s.id"
        >
          {{ s.nombre }} ({{ s.tipo }})
        </option>
      </select>
      <button type="button" class="btn-primary" @click="agregarSintoma" :disabled="!sintomaSeleccionadoId">
        Agregar
      </button>
    </div>

    <div
      v-for="id in form.sintomasSeleccionados"
      :key="id"
      class="border p-3 mb-3 rounded"
    >
      <div class="flex justify-between items-center">
        <strong>
          {{ obtenerNombreSintoma(id) }} ({{ obtenerTipoSintoma(id) }})
        </strong>
        <button type="button" class="btn btn-sm btn-outline-danger" @click="quitarSintoma(id)">Quitar</button>
      </div>

      <div class="mt-2 space-y-2 ml-2">
        <div v-if="obtenerTipoSintoma(id) === 'simple'">
          <label>Puntaje máximo:</label>
          <input
            type="number"
            min="1"
            v-model.number="form.puntajes[id].puntajeMaximo"
            required
          />
        </div>

        <div v-else>
          <label>Puntaje mínimo:</label>
          <input
            type="number"
            min="0"
            v-model.number="form.puntajes[id].puntajeMinimo"
            required
          />

          <label>Puntaje máximo:</label>
          <input
            type="number"
            min="1"
            v-model.number="form.puntajes[id].puntajeMaximo"
            required
          />

          <label>Valor de referencia:</label>
          <input
            type="number"
            step="0.1"
            v-model.number="form.puntajes[id].valorReferencia"
            required
          />
        </div>
      </div>
    </div>

    <div class="mt-4">
      <button type="submit" class="btn-primary">
        {{ modoEdicion ? 'Actualizar' : 'Guardar' }} Enfermedad
      </button>
      <button type="button" class="btn-secondary ml-2" @click="$emit('cancelar')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import type { Enfermedad } from '@/components/types'

const props = defineProps<{
  enfermedadSeleccionada: Enfermedad | null
  sintomasDisponibles: {
    id: number
    nombre: string
    tipo: 'simple' | 'compuesto'
    puntajeMinimo?: number
    puntajeMaximo: number
    valorReferencia?: number
  }[]
  modoEdicion: boolean
}>()

const emit = defineEmits<{
  (e: 'creada', enfermedad: Enfermedad): void
  (e: 'cancelar'): void
}>()

const form = ref({
  id: undefined as number | undefined,
  nombre: '',
  descripcion: '',
  sintomasSeleccionados: [] as number[],
  puntajes: {} as Record<
    number,
    {
      puntajeMinimo?: number
      puntajeMaximo: number
      valorReferencia?: number
    }
  >
})

const sintomaSeleccionadoId = ref<number | ''>('')

const sintomasDisponiblesFiltrados = computed(() =>
  props.sintomasDisponibles.filter(s => !form.value.sintomasSeleccionados.includes(s.id))
)

function agregarSintoma() {
  if (sintomaSeleccionadoId.value === '') return

  const id = sintomaSeleccionadoId.value as number
  const sintoma = props.sintomasDisponibles.find(s => s.id === id)
  if (!sintoma) return

  form.value.sintomasSeleccionados.push(id)

  form.value.puntajes[id] =
    sintoma.tipo === 'compuesto'
      ? {
          puntajeMinimo: sintoma.puntajeMinimo ?? 0,
          puntajeMaximo: sintoma.puntajeMaximo ?? 10,
          valorReferencia: sintoma.valorReferencia ?? 0
        }
      : {
          puntajeMaximo: sintoma.puntajeMaximo ?? 10
        }

  sintomaSeleccionadoId.value = ''
}

function quitarSintoma(id: number) {
  form.value.sintomasSeleccionados = form.value.sintomasSeleccionados.filter(sid => sid !== id)
  delete form.value.puntajes[id]
}

function obtenerNombreSintoma(id: number): string {
  return props.sintomasDisponibles.find(s => s.id === id)?.nombre ?? 'Desconocido'
}

function obtenerTipoSintoma(id: number): 'simple' | 'compuesto' {
  return props.sintomasDisponibles.find(s => s.id === id)?.tipo ?? 'simple'
}

watch(
  () => props.enfermedadSeleccionada,
  (nueva) => {
    if (nueva) {
      form.value = {
        id: nueva.id,
        nombre: nueva.nombre,
        descripcion: nueva.descripcion,
        sintomasSeleccionados: nueva.sintomas.map(s => s.id),
        puntajes: Object.fromEntries(
          nueva.sintomas.map(s => [
            s.id,
            {
              puntajeMaximo: s.puntajeMaximo,
              puntajeMinimo: s.puntajeMinimo ?? 0,
              valorReferencia: s.valorReferencia
            }
          ])
        )
      }
    } else {
      limpiarFormulario()
    }
  },
  { immediate: true }
)

function enviarFormulario() {
  const sintomas = form.value.sintomasSeleccionados.map(id => {
    const p = form.value.puntajes[id]
    return {
      id,
      puntajeMaximo: p.puntajeMaximo,
      puntajeMinimo: p.puntajeMinimo ?? 0,
      valorReferencia: p.valorReferencia
    }
  })

  emit('creada', {
    id: form.value.id,
    nombre: form.value.nombre,
    descripcion: form.value.descripcion,
    sintomas
  })

  limpiarFormulario()
}

function limpiarFormulario() {
  form.value = {
    id: undefined,
    nombre: '',
    descripcion: '',
    sintomasSeleccionados: [],
    puntajes: {}
  }
}
</script>

<style scoped>
input,
select,
textarea {
  padding: 6px;
  margin-top: 4px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-descripcion {
  resize: vertical;
  width: 100%;
  max-width: 400px;
  padding: 6px;
}

.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
.btn-secondary {
  @apply bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400;
}
.btn-outline-danger {
  @apply border border-red-600 text-red-600 px-2 py-1 rounded hover:bg-red-100;
}
</style>
