export default function Footer() {
  return (
    <div className="relative z-10 bg-black text-white px-6 py-15 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm border-b pb-15 pt-5">
        <div className="flex items-center gap-2 mr-10">
          <img src="/logo-purple.png" className="h-5" alt="Peculiar logo" />
          Peculiar
        </div>

        <div className="flex gap-2 text-xs">
          <span>Privacy Policy</span>
          <span className="font-bold">.</span>
          <span>Contact Us</span>
        </div>

        <div className="flex gap-3 text-xs">
          <a href="https://www.youtube.com/your-page" target="_blank" rel="noopener noreferrer">
            <img src="/footericons/youtube.png" className="w-5 h-5" alt="YouTube" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <img src="/footericons/linkedin.png" className="w-5 h-5" alt="LinkedIn" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/footericons/instagram.png" className="w-5 h-5" alt="Instagram" />
          </a>
          <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
            <img src="/footericons/twitter.png" className="w-5 h-5" alt="X (Twitter)" />
          </a>
        </div>
      </div>

      <div className="flex flex-col min-h-[40px] justify-between items-center">
        <div className="text-xs opacity-70 mt-10">
          © {new Date().getFullYear()} Peculiar All rights Reserved
        </div>
      </div>
    </div>
  )
}
