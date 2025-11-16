"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero(){
  return (
    <section className="flex flex-col items-center justify-center text-center py-28 px-6">
      <motion.h1 className="text-6xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-[linear-gradient(180deg,#f9fafb_0%,#dfe5ee_32%,#a6afba_55%,#e7ebf2_76%,#b9c1cc_100%)] drop-shadow" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        CYS | Change Your Style
      </motion.h1>
      <div className="h-0.5 w-56 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(229,231,235,0.7),rgba(255,255,255,0))] mb-6" />
      <motion.p className="text-lg text-neutral-600 max-w-2xl mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        我們以創新科技打造時尚品牌，讓風格成為你的語言。
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-4">
        <Link href="/portfolio" className="px-6 py-3 rounded-xl transition text-neutral-800
          bg-[linear-gradient(180deg,#f9fafb_0%,#e7ecf3_42%,#cdd3dc_52%,#eff2f7_70%,#d4dae3_100%)]
          border border-[rgba(236,240,244,0.85)]
          ring-1 ring-white/60
          shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_30px_rgba(0,0,0,0.25)]
          hover:bg-[linear-gradient(180deg,#ffffff_0%,#edf1f6_42%,#d3d9e2_52%,#f3f6fb_70%,#dbe1ea_100%)]
          hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_14px_36px_rgba(0,0,0,0.28)]
        ">查看作品</Link>
        <Link href="/warranty" className="px-6 py-3 rounded-xl transition text-neutral-800
          bg-[linear-gradient(180deg,#eef1f5_0%,#d9dee6_45%,#b9c0ca_52%,#e6eaf0_72%,#c5ccd6_100%)]
          border border-[rgba(225,231,238,0.85)]
          ring-1 ring-white/50
          shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_26px_rgba(0,0,0,0.22)]
          hover:bg-[linear-gradient(180deg,#f7f9fb_0%,#e3e7ee_45%,#c4cbd4_52%,#edf1f6_72%,#d1d7e0_100%)]
          hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_14px_32px_rgba(0,0,0,0.26)]
        ">登記保固</Link>
      </motion.div>
    </section>
  )
}

