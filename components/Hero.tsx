"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero(){
  return (
    <section className="flex flex-col items-center justify-center text-center py-28 px-6 relative overflow-hidden">
      {/* 背景金色光效裝飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFA500] opacity-5 rounded-full blur-3xl"></div>
      </div>
      
      <motion.h1 
        className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-[#FFD700] via-[#FFE44D] to-[#FFA500] drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] relative z-10" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        CYS | Change Your Style
      </motion.h1>
      
      <div className="h-1 w-72 rounded-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mb-8 shadow-[0_0_20px_rgba(255,215,0,0.6)] relative z-10" />
      
      <motion.p 
        className="text-xl md:text-2xl text-neutral-300 max-w-3xl mb-12 font-light tracking-wide relative z-10" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3 }}
      >
        台灣總代理 · 專業包膜服務
        <br />
        <span className="text-[#FFD700] font-medium">以創新科技打造時尚品牌，讓風格成為你的語言</span>
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6 }} 
        className="flex flex-col sm:flex-row gap-6 relative z-10"
      >
        <Link 
          href="/portfolio" 
          className="group px-8 py-4 rounded-xl transition-all duration-300 text-black font-semibold text-lg
            bg-gradient-to-br from-[#FFD700] via-[#FFE44D] to-[#FFA500]
            border border-[#FFD700]/50
            shadow-[0_0_0_1px_rgba(255,215,0,0.3),0_8px_30px_rgba(255,215,0,0.3),0_0_40px_rgba(255,200,0,0.2)]
            hover:shadow-[0_0_0_1px_rgba(255,215,0,0.5),0_12px_40px_rgba(255,215,0,0.4),0_0_60px_rgba(255,200,0,0.3)]
            hover:scale-105
            hover:from-[#FFE44D] hover:via-[#FFD700] hover:to-[#FFC107]
          "
        >
          查看作品
        </Link>
        <Link 
          href="/warranty" 
          className="group px-8 py-4 rounded-xl transition-all duration-300 text-[#FFD700] font-semibold text-lg
            bg-black/40 backdrop-blur-sm
            border border-[#FFD700]/40
            shadow-[0_0_0_1px_rgba(255,215,0,0.2),0_8px_30px_rgba(0,0,0,0.3)]
            hover:bg-black/60
            hover:border-[#FFD700]/60
            hover:shadow-[0_0_0_1px_rgba(255,215,0,0.4),0_12px_40px_rgba(255,215,0,0.2),0_0_40px_rgba(255,200,0,0.15)]
            hover:scale-105
          "
        >
          登記保固
        </Link>
      </motion.div>
    </section>
  )
}

