// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Home from '@/paginas/Home.vue'
import Funcionarios from '@/paginas/Funcionarios.vue'
import Sintomas from '@/paginas/SintomasPatologias.vue'
import Unidades from '@/paginas/UnidadesReferencia.vue'
import ConfiguracionSemaforo from '@/paginas/ConfiguracionSemaforo.vue'
import Historial from '@/paginas/HistorialCambios.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/funcionarios', component: Funcionarios },
  { path: '/sintomas', component: Sintomas },
  { path: '/unidades', component: Unidades },
  { path: '/configuracion-semaforo', component: ConfiguracionSemaforo },
  { path: '/historial', component: Historial },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
