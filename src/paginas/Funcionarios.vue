<template>
  <div class="pagina-funcionarios">
    <h1 class="text-2xl font-bold mb-4">Gestión de Funcionarios</h1>

    <!-- Componente para formulario de creación/edición -->
    <FormFuncionario
      :modo-edicion="modoEdicion"
      :funcionarioSeleccionado="funcionarioSeleccionado"
      @guardado="cargarFuncionarios"
      @cancelar="cancelarEdicion"
    />

    <!-- Tabla con lista de funcionarios -->
    <TablaFuncionarios
      :funcionarios="funcionarios"
      @editar="editarFuncionario"
      @eliminar="eliminarFuncionario"
    />

    <!-- Alerta de éxito o error -->
    <Alerta
      v-if="mensaje"
      :tipo="tipoMensaje"
      :mensaje="mensaje"
       :visible="!!mensaje"
      @cerrar="mensaje = ''"
    />

    <!-- Modal de confirmación -->
    <ConfirmacionModal
      v-if="mostrarConfirmacion"
      mensaje="¿Estás seguro de eliminar este funcionario?"
      :mostrar="mostrarConfirmacion" 
      @confirmar="confirmarEliminacion"
      @cancelar="mostrarConfirmacion = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import FormFuncionario from '@/components/FormFuncionario.vue'
import TablaFuncionarios from '@/components/TablaFuncionarios.vue'
import Alerta from '@/components/Alerta.vue'
import ConfirmacionModal from '@/components/ConfirmacionModal.vue'
import { obtenerFuncionarios, eliminarFuncionario as eliminarAPI } from '@/services/api.ts'

interface Funcionario {
  id: number
  nombre: string
  rut: string
  email: string
  telefono: string
  unidad: string
}

const funcionarios = ref<Funcionario[]>([])
const funcionarioSeleccionado = ref<Funcionario | null>(null)
const modoEdicion = ref(false)
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')
const mostrarConfirmacion = ref(false)
const idAEliminar = ref<number | null>(null)

const cargarFuncionarios = async () => {
  try {
    funcionarios.value = await obtenerFuncionarios() // carga dinámica desde la API
  } catch (error) {
    tipoMensaje.value = 'error'
    mensaje.value = 'Error al cargar funcionarios.'
  }
}

const editarFuncionario = (funcionario: Funcionario) => {
  funcionarioSeleccionado.value = funcionario
  modoEdicion.value = true
}

const cancelarEdicion = () => {
  funcionarioSeleccionado.value = null
  modoEdicion.value = false
}

const eliminarFuncionario = (id: number) => {
  idAEliminar.value = id
  mostrarConfirmacion.value = true
}

const confirmarEliminacion = async () => {
  if (idAEliminar.value !== null) {
    try {
      await eliminarAPI(idAEliminar.value) // llamada al backend
      mensaje.value = 'Funcionario eliminado correctamente.'
      tipoMensaje.value = 'exito'
      cargarFuncionarios() // recargar datos después de eliminar
    } catch (error) {
      mensaje.value = 'Error al eliminar funcionario.'
      tipoMensaje.value = 'error'
    } finally {
      mostrarConfirmacion.value = false
      idAEliminar.value = null
    }
  }
}

onMounted(cargarFuncionarios)
</script>

<style scoped>
.pagina-funcionarios {
  padding: 1.5rem;
}
</style>
