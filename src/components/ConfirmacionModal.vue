<template>
  <div v-if="mostrar" class="modal">
    <div class="contenido">
      <p>{{ mensaje }}</p>
      <button @click="$emit('confirmar')">Confirmar</button>
      <button @click="$emit('cancelar')">Cancelar</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps<{
  mensaje: string
  mostrar: boolean
}>()
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.contenido {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}
</style>
