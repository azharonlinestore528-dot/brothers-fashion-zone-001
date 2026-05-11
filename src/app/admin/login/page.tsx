'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

const ADMIN_EMAIL = 'admin@bfz.com'
const ADMIN_PASSWORD = 'admin123'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    await new Promise(r => setTimeout(r, 800))

    const emailMatch = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()
    const passwordMatch = password === ADMIN_PASSWORD

    if (emailMatch && passwordMatch) {
      document.cookie = 'bfz_admin_auth=true; max-age=28800; path=/; SameSite=Strict'
      localStorage.setItem('bfz_admin_auth', 'true')
      router.push('/admin')
    } else {
      setError(emailMatch ? 'Wrong password. Try: admin123' : 'Wrong email. Try: admin@bfz.com')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-[#C9B99A]/20 rounded-full flex items-center justify-center">
            <Lock size={24} className="text-[#C9B99A]" />
          </div>
        </div>

        <h1 className="text-white text-2xl font-bold text-center mb-1">Brother's Fashion Zone</h1>
        <p className="text-[#C9B99A] text-xs uppercase tracking-widest text-center mb-8">Owner / Admin Access</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@bfz.com"
              required
              className="w-full h-12 bg-[#0F0F0F] border border-[#2A2A2A] text-white px-4 text-sm rounded-lg outline-none focus:border-[#C9B99A] placeholder:text-gray-600"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="admin123"
              required
              className="w-full h-12 bg-[#0F0F0F] border border-[#2A2A2A] text-white px-4 text-sm rounded-lg outline-none focus:border-[#C9B99A] placeholder:text-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 px-3 rounded-lg">{error}</p>
          )}

          <div className="bg-[#0F0F0F] rounded-lg p-3 text-center">
            <p className="text-gray-500 text-xs">Email: <span className="text-[#C9B99A] ml-1">admin@bfz.com</span></p>
            <p className="text-gray-500 text-xs mt-1">Password: <span className="text-[#C9B99A] ml-1">admin123</span></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#C9B99A] text-[#0A0A0A] font-bold text-sm rounded-lg hover:bg-[#B8A88A] disabled:opacity-60 transition-all duration-200"
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <button onClick={() => router.push('/')} className="w-full mt-6 text-gray-500 text-sm hover:text-white transition-colors">
          ← Back to Store
        </button>
      </div>
    </div>
  )
}