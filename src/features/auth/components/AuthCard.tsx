type Props = {
  children: React.ReactNode
}

export default function AuthCard({ children }: Props) {
  return (
    <div className="w-full max-w-md bg-[#3c2356] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-6 sm:p-8 text-white">
      {children}
    </div>
  )
}