import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    usuario: null as { id: number; username: string; nombre: string } | null
  }),
  actions: {
    cargarDesdeStorage() {
      const guardado = localStorage.getItem('usuario')
      if (guardado) {
        this.usuario = JSON.parse(guardado)
      }
    },
    iniciarSesion(usuario: { id: number; username: string; nombre: string }) {
      this.usuario = usuario
      localStorage.setItem('usuario', JSON.stringify(usuario))
    },
    cerrarSesion() {
      this.usuario = null
      localStorage.removeItem('usuario')
    }
  }
})
