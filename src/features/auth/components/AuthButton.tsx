type Props = {
  children: React.ReactNode
  variant?: "primary" | "google"
}

export default function AuthButton({ children, variant = "primary" }: Props) {
  const base = "w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"

  const styles = {
    primary: "bg-[#FEFEFE] text-black hover:bg-gray-300",
    google: "bg-[#e7cfc9] text-[#3A2256] hover:opacity-90",
  }

  return (
    <button className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  )
}