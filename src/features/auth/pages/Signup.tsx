import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import AuthInput from "../components/AuthInput"
import AuthButton from "../components/AuthButton"
import AuthCard from "../components/AuthCard"
import { storage } from "../../../lib/storage"

export default function Signup() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      if (showVerification) {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token: verificationCode }),
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message || 'Verification failed')

        setShowVerification(false)
        setIsLogin(true)
        setErrorMsg('Email verified! Please sign in.')
        return
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin
        ? { email, password }
        : { email, password, firstName, lastName, phone: '0000000000' }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Something went wrong')

      if (isLogin) {
        storage.setUser({
          id: data.user.id,
          name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.email,
          email: data.user.email,
          role: data.user.role,
          token: data.accessToken,
          refreshToken: data.refreshToken,
        })
        navigate({ to: '/' })
      } else {
        setShowVerification(true)
        setErrorMsg('Account created! Check your email for a 6-digit verification code.')
      }
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResendCode() {
    setLoading(true)
    setErrorMsg("")

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Failed to resend code')

      setErrorMsg('Verification code resent! Check your email.')
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#e7cfc9] px-4 sm:px-6">

      {/* LOGO */}
      <div className="w-full max-w-5xl mx-auto mb-4 flex items-center gap-2 font-bold mt-6 sm:mt-10">
        <img src="/logo-purple.png" alt="peculiar logo" className="h-6" />
        <span className="text-[#3A2256]">Peculiar</span>
      </div>

      {/* MAIN */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mt-6 sm:mt-10 mb-10">

        {/* LEFT */}
        <div className="flex-1 flex flex-col items-center">

          <AuthCard>
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
              {showVerification ? 'Verify Email' : isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-center text-sm text-[#EBF2FC] mb-6">
              {showVerification 
                ? 'Enter the 6-digit code sent to your email.' 
                : isLogin ? 'Sign in to your account.' : 'Turn your event dreams into a seamless reality.'}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {showVerification ? (
                <>
                  <AuthInput
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm text-blue-400 underline"
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                </>
              ) : (
                <>
                  {!isLogin && (
                    <>
                      <AuthInput
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <AuthInput
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </>
                  )}
                  <AuthInput
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <AuthInput
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              )}

              {errorMsg && (
                <p className="text-sm text-red-300 bg-red-900/30 p-2 rounded-lg">{errorMsg}</p>
              )}

              <AuthButton>{loading ? 'Please wait...' : showVerification ? 'Verify Email' : isLogin ? 'Sign In' : 'Sign Up'}</AuthButton>
            </form>

            <p className="text-center text-sm text-[#EBF2FC] mt-6">
              {showVerification ? (
                <span
                  className="text-blue-400 cursor-pointer underline"
                  onClick={() => { setShowVerification(false); setIsLogin(false); setErrorMsg('') }}
                >
                  Back to Sign Up
                </span>
              ) : (
                <>
                  {isLogin ? "Don't have an account? " : 'Have an account? '}
                  <span
                    className="text-blue-400 cursor-pointer underline"
                    onClick={() => { setIsLogin(!isLogin); setErrorMsg('') }}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </span>
                </>
              )}
            </p>
          </AuthCard>

          {/* Footer */}
          <div className="w-full max-w-md flex flex-col sm:flex-row justify-between items-center gap-2 mt-8 text-xs">
            <span className="text-gray-700">
              © {new Date().getFullYear()} Peculiar
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 hidden md:flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#3A2256] mb-3">
            Don't wait, to Start
          </h2>
          <p className="text-[#3A2256] text-sm font-semibold mb-10 max-w-sm">
            Planning your event in a much <br /> easier way with Peculiar
          </p>
        </div>
      </div>
    </div>
  )
}
