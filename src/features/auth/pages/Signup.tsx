import AuthInput from "../components/AuthInput"
import AuthButton from "../components/AuthButton"
import AuthCard from "../components/AuthCard"

export default function Signup() {
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
              Get Started
            </h1>
            <p className="text-center text-sm text-[#EBF2FC] mb-6">
              Turn your event dreams into a seamless reality.
            </p>

            <form className="space-y-4">
              <AuthInput placeholder="Full Name" />
              <AuthInput type="email" placeholder="Email Address" />
              <AuthInput type="password" placeholder="Password" />

              <AuthButton>Sign Up</AuthButton>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-gray-400/40"></div>
              <span className="text-sm text-gray-300">or</span>
              <div className="flex-1 h-[1px] bg-gray-400/40"></div>
            </div>

            <AuthButton variant="google">
              <img src="/google-logo.png" className="h-5" />
              Sign up with Google
            </AuthButton>

            <p className="text-center text-sm text-[#EBF2FC] mt-6">
              Have an account?{" "}
              <span className="text-blue-400 cursor-pointer">
                Sign in
              </span>
            </p>
          </AuthCard>

          {/* Footer */}
          <div className="w-full max-w-md flex flex-col sm:flex-row justify-between items-center gap-2 mt-8 text-xs">
            <span className="text-gray-700">
              © {new Date().getFullYear()} Peculiar
            </span>
            <span className="text-blue-500 cursor-pointer">
              Need help?
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 hidden md:flex flex-col justify-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#3A2256] mb-3">
            Dont wait, to Start
          </h2>

          <p className="text-[#3A2256] text-sm font-semibold mb-10 max-w-sm">
            Planning your event in a much <br /> easier way with Peculiar
          </p>

          <img src="/carriage.png" className="w-64 md:w-80 lg:w-96" />
        </div>
      </div>
    </div>
  )
}

