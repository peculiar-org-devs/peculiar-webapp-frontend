type Props = {
  type?: string
  placeholder: string
}

export default function AuthInput({ type = "text", placeholder }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-full px-4 py-3 rounded-lg bg-[#5a3a73] placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-white/30"
    />
  )
}