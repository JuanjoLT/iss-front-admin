<!-- src/components/FormProfesion.vue -->
<template>
  <form @submit.prevent="enviar">
    <label for="nombre">Nombre de la profesión:</label>
    <input
      v-model="form.nombre"
      type="text"
      id="nombre"
      required
      maxlength="50"
    />

    <div class="mt-3">
      <button type="submit" class="btn btn-primary">
        {{ modoEdicion ? 'Actualizar' : 'Agregar' }}
      </button>
      <button type="button" class="btn btn-secondary ml-2" @click="$emit('cancelar')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modoEdicion: boolean
  profesionSeleccionada: { id: number | undefined; nombre: string } | null
}>()

const emit = defineEmits(['guardado', 'cancelar'])

const form = ref({ nombre: '', id: undefined as number | undefined })

watch(
  () => props.profesionSeleccionada,
  (nueva) => {
    form.value = nueva ? { ...nueva } : { nombre: '', id: undefined }
  },
  { immediate: true }
)

const enviar = () => {
  emit('guardado', { ...form.value })
}
</script>

<style scoped>
input {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  padding: 6px 12px;
  border-radius: 4px;
}
.btn-primary {
  background-color: #1d4ed8;
  color: white;
}
.btn-secondary {
  background-color: #ccc;
}
</style>
