import axios from 'axios'

const API_URL ='http://localhost:3000' // cambia esto con la URL real de tu backend

// obtener usuarios
export async function obtenerUsuarios() {
  try {
    const response = await axios.get(`${API_URL}/usuarios`)
    return response.data
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error
  }
}
//  obtener lista de funcionarios
export async function obtenerFuncionarios() {
  try {
    const response = await axios.get(`${API_URL}/funcionarios`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo funcionarios:', error)
    throw error
  }
}
export async function crearFuncionario(funcionario: {
  nombre: string
  rut: string
  email: string
  telefono: string
  unidad: string
}) {
  const response = await axios.post(`${API_URL}/funcionarios`, funcionario)
  return response.data
}
// actualizar un funcionario existente
export async function actualizarFuncionario(id: number, funcionario: {
  nombre: string
  rut: string
  email: string
  telefono: string
  unidad: string
}) {
  try {
    const response = await axios.put(`${API_URL}/funcionarios/${id}`, funcionario)
    return response.data
  } catch (error) {
    console.error('Error actualizando funcionario:', error)
    throw error
  }
}
// eliminar un funcionario
export async function eliminarFuncionario(id: number) {
  try {
    await axios.delete(`${API_URL}/funcionarios/${id}`)
  } catch (error) {
    console.error('Error eliminando funcionario:', error)
    throw error
  }
}
// obtener configuración del semáforo
export async function obtenerConfiguracion() {
  try {
    const response = await axios.get(`${API_URL}/configuracion-semaforo`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo configuración del semáforo:', error)
    throw error
  }
}
// actualizar configuración del semáforo
export async function actualizarConfiguracion(configuracion: {
  verde: number
  amarillo: number
}) {
  try {
    const response = await axios.put(`${API_URL}/configuracion-semaforo`, configuracion)
    return response.data
  } catch (error) {
    console.error('Error actualizando configuración del semáforo:', error)
    throw error
  }
}
// obtener logs
export async function obtenerLogs() {
  try {
    const response = await axios.get(`${API_URL}/logs`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo logs:', error)
    throw error
  }
}
// CRUD de síntomas
export async function obtenerSintomas() {
  const response = await axios.get(`${API_URL}/sintomas`)
  return response.data
}

export async function crearSintoma(sintoma: {
  nombre: string
  tipo: 'simple' | 'compuesto'
  puntajeMaximo: number
  puntajeMinimo?: number
  valorReferencia?: number
  descripcion: string
}) {
  const response = await axios.post(`${API_URL}/sintomas`, sintoma)
  return response.data
}

export async function actualizarSintoma(id: number, sintoma: {
  nombre: string
  tipo: 'simple' | 'compuesto'
  puntajeMaximo: number
  puntajeMinimo?: number
  valorReferencia?: number
  descripcion: string
}) {
  const response = await axios.put(`${API_URL}/sintomas/${id}`, sintoma)
  return response.data
}

export async function eliminarSintoma(id: number) {
  await axios.delete(`${API_URL}/sintomas/${id}`)
}
// Obtener unidades de referencia
export async function obtenerUnidades() {
  try {
    const response = await axios.get(`${API_URL}/unidades`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo unidades:', error)
    throw error
  }
}
// Crear unidad de referencia
export async function crearUnidad(unidad: {
  nombre: string
  calle: string
  comuna: string
  region: string
  telefono: string
}) {
  try {
    const response = await axios.post(`${API_URL}/unidades`, unidad)
    return response.data
  } catch (error) {
    console.error('Error creando unidad:', error)
    throw error
  }
}
// Actualizar unidad
export async function actualizarUnidad(id: number, unidad: {
  nombre: string
  calle: string
  comuna: string
  region: string
  telefono: string
}) {
  try {
    const response = await axios.put(`${API_URL}/unidades/${id}`, unidad)
    return response.data
  } catch (error) {
    console.error('Error actualizando unidad:', error)
    throw error
  }
}
// Eliminar unidad
export async function eliminarUnidad(id: number) {
  try {
    await axios.delete(`${API_URL}/unidades/${id}`)
  } catch (error) {
    console.error('Error eliminando unidad:', error)
    throw error
  }
}

export async function registrarLog(log: {
  fecha: string
  usuario: string
  accion: string
  descripcion: string
}) {
  try {
    await axios.post(`${API_URL}/logs`, log)
  } catch (error) {
    console.error('Error registrando log:', error)
  }
}
// crear una nueva enfermedad
export async function crearEnfermedad(enfermedad: {
  nombre: string
  descripcion: string
  sintomas: {
    id: number
    puntajeMaximo: number
    puntajeMinimo?: number
    valorReferencia?: number
  }[]
}) {
  try {
    const response = await axios.post(`${API_URL}/enfermedades`, enfermedad)
    return response.data
  } catch (error) {
    console.error('Error creando enfermedad:', error)
    throw error
  }
}
// Obtener todas las enfermedades
export async function obtenerEnfermedades() {
  try {
    const response = await axios.get(`${API_URL}/enfermedades`)
    return response.data
  } catch (error) {
    console.error('Error obteniendo enfermedades:', error)
    throw error
  }
}
// Actualizar una enfermedad
export async function actualizarEnfermedad(id: number, enfermedad: {
  nombre: string
  descripcion: string
  sintomas: {
    id: number
    puntajeMaximo: number
    puntajeMinimo: number
    valorReferencia?: number
  }[]
}) {
  try {
    const response = await axios.put(`${API_URL}/enfermedades/${id}`, enfermedad)
    return response.data
  } catch (error) {
    console.error('Error actualizando enfermedad:', error)
    throw error
  }
}
// Eliminar una enfermedad
export async function eliminarEnfermedad(id: number) {
  try {
    await axios.delete(`${API_URL}/enfermedades/${id}`)
  } catch (error) {
    console.error('Error eliminando enfermedad:', error)
    throw error
  }
}
export async function obtenerProfesiones() {
  const response = await axios.get(`${API_URL}/profesiones`)
  return response.data
}

export async function crearProfesion(profesion: { nombre: string }) {
  const response = await axios.post(`${API_URL}/profesiones`, profesion)
  return response.data
}

export async function actualizarProfesion(id: number, profesion: { nombre: string }) {
  const response = await axios.put(`${API_URL}/profesiones/${id}`, profesion)
  return response.data
}

export async function eliminarProfesion(id: number) {
  const response = await axios.delete(`${API_URL}/profesiones/${id}`)
  return response.data
}