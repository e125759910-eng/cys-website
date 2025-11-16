"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero(){
  return (
    <section className="flex flex-col items-center justify-center text-center py-28 px-6">
      <motion.h1 className="text-6xl font-bold mb-6 text-neutral-100" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        CYS | Change Your Style
      </motion.h1>
      <motion.p className="text-lg text-neutral-400 max-w-2xl mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        我們以創新科技打造時尚品牌，讓風格成為你的語言。
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-4">
        <Link href="/portfolio" className="bg-neutral-800 text-white px-6 py-3 rounded-lg hover:bg-neutral-700 transition border border-white/10">查看作品</Link>
        <Link href="/warranty" className="border border-white/20 text-neutral-200 px-6 py-3 rounded-lg hover:bg-white/10 transition">登記保固</Link>
      </motion.div>
    </section>
  )
}

