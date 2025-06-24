<template>
  <div>
    <input v-model="filtro" placeholder="Buscar..." />
    <table>
      <thead>
        <tr>
          <th v-for="col in columnas" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filtrados" :key="item.id">
          <td v-for="col in columnas" :key="col">{{ item[col] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, defineProps } from 'vue'

const props = defineProps<{
  data: Record<string, any>[]
  columnas: string[]
}>()

const filtro = ref('')

const filtrados = computed(() =>
  props.data.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(filtro.value.toLowerCase())
  )
)
</script>
