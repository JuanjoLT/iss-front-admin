<template>
  <div v-if="visible" :class="['alerta', tipo]">
    {{ mensaje }}
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  mensaje: string
  tipo: 'exito' | 'error'
  visible: boolean
}>()
</script>

<style scoped>
.alerta {
  padding: 1rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  font-weight: bold;
}
.exito {
  background-color: #d1fae5;
  color: #065f46;
}
.error {
  background-color: #fee2e2;
  color: #991b1b;
}
</style>
