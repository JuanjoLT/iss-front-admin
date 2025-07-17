<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Gestión de Funcionarios y Profesiones</h2>
    <!-- Contenido de la pestaña actual -->
    <div v-if="$route.path === '/funcionarios'">
      <!-- Formulario -->
      <FormFuncionario
        :modo-edicion="modoEdicion"
        :funcionarioSeleccionado="funcionarioSeleccionado"
        @guardado="guardarFuncionario"
        @cancelar="cancelarEdicion"
      />

      <!-- Tabla -->
      <TablaFuncionarios
        :funcionarios="funcionarios"
        @editar="editarFuncionario"
        @eliminar="eliminarFuncionario"
      />

      <!-- Alerta -->
      <Alerta
        v-if="mensaje"
        :tipo="tipoMensaje"
        :mensaje="mensaje"
        :visible="!!mensaje"
        @cerrar="mensaje = ''"
      />

      <!-- Confirmación -->
      <ConfirmacionModal
        v-if="mostrarConfirmacion"
        mensaje="¿Estás seguro de eliminar este funcionario?"
        :mostrar="mostrarConfirmacion"
        @confirmar="confirmarEliminacion"
        @cancelar="mostrarConfirmacion = false"
      />
    </div>

    <!-- Aquí se cargará Profesiones.vue si el usuario está en esa ruta -->
    <router-view v-else />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import FormFuncionario from '@/components/FormFuncionario.vue'
import TablaFuncionarios from '@/components/TablaFuncionarios.vue'
import Alerta from '@/components/Alerta.vue'
import ConfirmacionModal from '@/components/ConfirmacionModal.vue'

import {
  obtenerFuncionarios,
  eliminarFuncionario as eliminarAPI,
  crearFuncionario,
  actualizarFuncionario,
  registrarLog
} from '@/services/api'

import type { Funcionario } from '@/components/types'

const route = useRoute()
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
const nombreUsuario = usuario?.nombre ?? 'Desconocido'

const funcionarios = ref<Funcionario[]>([])
const funcionarioSeleccionado = ref<Funcionario | null>(null)
const modoEdicion = ref(false)
const mensaje = ref('')
const tipoMensaje = ref<'exito' | 'error'>('exito')
const mostrarConfirmacion = ref(false)
const idAEliminar = ref<number | null>(null)

const cargarFuncionarios = async () => {
  try {
    funcionarios.value = await obtenerFuncionarios()
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
      const eliminado = funcionarios.value.find(f => f.id === idAEliminar.value)
      await eliminarAPI(idAEliminar.value)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Eliminar Funcionario',
        descripcion: `Se eliminó al funcionario "${eliminado?.nombre ?? 'desconocido'}"`
      })
      mensaje.value = 'Funcionario eliminado correctamente.'
      tipoMensaje.value = 'exito'
      await cargarFuncionarios()
    } catch (error) {
      mensaje.value = 'Error al eliminar funcionario.'
      tipoMensaje.value = 'error'
    } finally {
      mostrarConfirmacion.value = false
      idAEliminar.value = null
    }
  }
}

const guardarFuncionario = async (nuevo: Funcionario) => {
  try {
    const yaExiste = funcionarios.value.some(
      (f) => f.rut === nuevo.rut && (!modoEdicion.value || f.id !== funcionarioSeleccionado.value?.id)
    )

    if (yaExiste) {
      mensaje.value = 'Ya existe un funcionario con ese RUT.'
      tipoMensaje.value = 'error'
      return
    }

    if (modoEdicion.value && funcionarioSeleccionado.value?.id) {
      await actualizarFuncionario(funcionarioSeleccionado.value.id, nuevo)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Actualizar Funcionario',
        descripcion: `Se actualizó el funcionario ${nuevo.nombre}`
      })
      mensaje.value = 'Funcionario actualizado correctamente.'
    } else {
      await crearFuncionario(nuevo)
      await registrarLog({
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        accion: 'Crear Funcionario',
        descripcion: `Se creó el funcionario ${nuevo.nombre}`
      })
      mensaje.value = 'Funcionario creado correctamente.'
    }

    tipoMensaje.value = 'exito'
    await cargarFuncionarios()
  } catch (error) {
    tipoMensaje.value = 'error'
    mensaje.value = 'Error al guardar funcionario.'
  } finally {
    funcionarioSeleccionado.value = null
    modoEdicion.value = false
  }
}

onMounted(cargarFuncionarios)
</script>

<style scoped>
.tab-link {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  color: #1d4ed8;
  background-color: #e7f1ff;
  transition: background-color 0.2s ease;
}
.tab-link:hover {
  background-color: #dbeafe;
}
.tab-link.active {
  font-weight: bold;
  background-color: #cfe0ff;
}
</style>
