import { createRouter, createWebHistory } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuarios'
import Registro from '@/paginas/Registro.vue'
import Home from '@/paginas/Home.vue'
import Funcionarios from '@/paginas/Funcionarios.vue'
import Sintomas from '@/paginas/SintomasPatologias.vue'
import Enfermedades from '@/paginas/GestionEnfermedades.vue'
import Unidades from '@/paginas/UnidadesReferencia.vue'
import ConfiguracionSemaforo from '@/paginas/ConfiguracionSemaforo.vue'
import Historial from '@/paginas/HistorialCambios.vue'
import GestionProfesiones from '@/paginas/GestionProfesiones.vue'

const routes = [
  { path: '/', component: Registro },
  { path: '/home', component: Home },
  { path: '/funcionarios', component: Funcionarios,},
  { path: '/sintomas', component: Sintomas },
  { path: '/sintomas/enfermedades', component: Enfermedades },
  { path: '/unidades', component: Unidades },
  { path: '/configuracion-semaforo', component: ConfiguracionSemaforo },
  { path: '/historial', component: Historial },
  { path: '/funcionarios/profesiones', component: GestionProfesiones },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const usuarioStore = useUsuarioStore()
  usuarioStore.cargarDesdeStorage()

  // No requiere autenticación para entrar a "/"
  if (to.path === '/') return next()

  // Requiere sesión activa
  if (!usuarioStore.usuario) {
    return next('/')
  }

  next()
})

export default router
