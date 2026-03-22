const AUTH_KEY = 'peculiar_auth_user'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
  token: string
}

export const storage = {
  getUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AuthUser
    } catch {
      return null
    }
  },

  setUser(user: AuthUser): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  },

  clearUser(): void {
    localStorage.removeItem(AUTH_KEY)
  },

  isAuthenticated(): boolean {
    return this.getUser() !== null
  },
}
