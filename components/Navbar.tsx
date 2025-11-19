"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="flex justify-between items-center px-6 md:px-8 py-5 bg-black/40 backdrop-blur-md border-b border-[#FFD700]/30 text-neutral-200 sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <Link href="/" className="group relative">
          <div className="relative px-4 py-2.5 rounded-xl bg-black/60 border-2 border-[#FFD700]/50 shadow-[0_0_0_1px_rgba(255,215,0,0.2),0_4px_20px_rgba(255,215,0,0.25),0_0_30px_rgba(255,200,0,0.15)] backdrop-blur-md hover:border-[#FFD700]/70 hover:shadow-[0_0_0_1px_rgba(255,215,0,0.4),0_6px_30px_rgba(255,215,0,0.35),0_0_40px_rgba(255,200,0,0.25)] transition-all duration-300">
            {/* 背景金色光效 */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* LOGO */}
            <img 
              src="/logo.svg" 
              alt="CYS Logo" 
              className="relative w-32 md:w-36 h-auto opacity-100 drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] transition-all duration-300" 
              style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' }}
            />
          </div>
        </Link>
      </div>
      <ul className="flex gap-4 md:gap-6 text-sm md:text-base">
        <li>
          <Link 
            href="/" 
            className={`relative px-3 py-2 transition-all duration-300 ${
              pathname === "/" 
                ? "text-[#FFD700] font-semibold" 
                : "text-neutral-300 hover:text-[#FFD700]"
            }`}
          >
            首頁
            {pathname === "/" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></span>
            )}
          </Link>
        </li>
        <li>
          <Link 
            href="/portfolio" 
            className={`relative px-3 py-2 transition-all duration-300 ${
              pathname === "/portfolio" 
                ? "text-[#FFD700] font-semibold" 
                : "text-neutral-300 hover:text-[#FFD700]"
            }`}
          >
            作品集
            {pathname === "/portfolio" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></span>
            )}
          </Link>
        </li>
        <li>
          <Link 
            href="/warranty" 
            className={`relative px-3 py-2 transition-all duration-300 ${
              pathname === "/warranty" 
                ? "text-[#FFD700] font-semibold" 
                : "text-neutral-300 hover:text-[#FFD700]"
            }`}
          >
            電子保固
            {pathname === "/warranty" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></span>
            )}
          </Link>
        </li>
        <li>
          <Link 
            href="/contact" 
            className={`relative px-3 py-2 transition-all duration-300 ${
              pathname === "/contact" 
                ? "text-[#FFD700] font-semibold" 
                : "text-neutral-300 hover:text-[#FFD700]"
            }`}
          >
            聯絡我們
            {pathname === "/contact" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

