export default function Footer(){
  return (
    <footer className="py-10 text-center bg-black/50 border-t border-[#FFD700]/20 backdrop-blur-sm relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-4">
          <p className="text-[#FFD700] font-semibold text-lg mb-2">CYS | Change Your Style</p>
          <p className="text-neutral-400 text-sm">台灣總代理 · 專業包膜服務</p>
        </div>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent mb-4"></div>
        <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} CYS | Change Your Style — All rights reserved.</p>
      </div>
    </footer>
  )
}

