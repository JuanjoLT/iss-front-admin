export interface Funcionario {
  id?: number
  nombre: string
  rut: string
  email: string
  telefono: string
  unidad: string
  profesion: string
}

export interface Sintoma {
  id: number
  nombre: string
  descripcion: string
  tipo: 'simple' | 'compuesto'
  puntajeMinimo?: number
  puntajeMaximo: number
  valorReferencia?: number
}

export interface Unidad {
  id?: number
  nombre: string
  calle: string
  comuna: string
  region: string
  telefono: string
}

export interface ConfiguracionSemaforo {
  verde: number
  amarillo: number
}

export interface Log {
  id?: number
  fecha: string
  usuario: string
  accion: string
  descripcion: string
}
export interface Enfermedad {
  id?: number
  nombre: string
  descripcion: string
  sintomas: {
    id: number
    puntajeMaximo: number
    puntajeMinimo?: number
    valorReferencia?: number
  }[]
}