type Props = {
  type?: string
  placeholder: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AuthInput({ type = "text", placeholder, value, onChange }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-lg bg-[#5a3a73] placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-white/30"
    />
  )
}
