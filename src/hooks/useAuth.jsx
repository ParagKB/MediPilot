import { useState, useEffect, createContext, useContext } from 'react'
import { db } from '../services/database'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('medipilot_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const user = db.findUserByEmail(email)
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user
      setUser(userWithoutPassword)
      localStorage.setItem('medipilot_user', JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('medipilot_user')
  }

  const updateUserPreference = (preferred_interface) => {
    if (user) {
      const updatedUser = db.updateUser(user.id, { preferred_interface })
      const { password: _, ...userWithoutPassword } = updatedUser
      setUser(userWithoutPassword)
      localStorage.setItem('medipilot_user', JSON.stringify(userWithoutPassword))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserPreference }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
