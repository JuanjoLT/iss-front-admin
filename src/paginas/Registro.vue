<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-section">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Usuario</label>
            <input
              v-model="login.username"
              type="text"
              required
              maxlength="30"
              pattern="^[a-zA-Z0-9_@.-]+$"
            />
          </div>

          <!-- Campo de contraseña con botón para mostrar/ocultar -->
          <div class="form-group password-wrapper">
            <label>Contraseña</label>
            <div class="password-field">
              <input
                :type="verContrasena ? 'text' : 'password'"
                v-model="login.password"
                required
                maxlength="30"
                pattern="^[a-zA-Z0-9!@#%&*._-]+$"
              />
              <button type="button" class="toggle-btn" @click="verContrasena = !verContrasena">
                {{ verContrasena ? 'Ocultar' : 'Ver' }}
              </button>
            </div>
          </div>

          <div v-if="mensaje" class="mensaje-error">{{ mensaje }}</div>
          <button type="submit" class="btn">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerUsuarios } from '@/services/api'

const router = useRouter()

const login = ref({
  username: '',
  password: ''
})
const mensaje = ref('')
const verContrasena = ref(false)

const handleLogin = async () => {
  const username = login.value.username.trim()
  const password = login.value.password.trim()

  const regex = /^[a-zA-Z0-9_.@-]+$/
  if (!regex.test(username) || !regex.test(password)) {
    alert('Caracteres no válidos en usuario o contraseña')
    return
  }

  try {
    const usuarios = await obtenerUsuarios()
    const encontrado = usuarios.find(
      (u: any) => u.username === username && u.password === password
    )

    if (encontrado) {
      localStorage.setItem('usuario', JSON.stringify(encontrado))
      router.push('/home')
    } else {
      alert('Usuario o contraseña incorrectos')
    }
  } catch (error) {
    alert('Error al verificar usuario')
    console.error(error)
  }
}
</script>

<style scoped>
.auth-container {
  background-color: #e6f2ff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-box {
  background-color: #ffffffcc;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
}

.auth-section {
  flex: 1;
}

h2 {
  color: #007bff;
  margin-bottom: 1rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.form-group input {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.mensaje-error {
  color: red;
  font-size: 0.9rem;
  margin-top: -8px;
  margin-bottom: 10px;
}

.btn {
  margin-top: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

/* Contraseña con botón para mostrar/ocultar */
.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field input {
  flex: 1;
  padding-right: 80px;
}

.toggle-btn {
  position: absolute;
  right: 4px;
  padding: 6px 10px;
  background-color: transparent;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.85rem;
}

.toggle-btn:hover {
  text-decoration: underline;
}
</style>
