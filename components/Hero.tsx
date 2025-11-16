"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero(){
  return (
    <section className="flex flex-col items-center justify-center text-center py-28 px-6">
      <motion.h1 className="text-6xl font-bold mb-6 text-white" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        CYS | Change Your Style
      </motion.h1>
      <motion.p className="text-lg text-brand-light max-w-2xl mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        我們以創新科技打造時尚品牌，讓風格成為你的語言。
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-4">
        <Link href="/portfolio" className="bg-brand-blue px-6 py-3 rounded-lg hover:bg-blue-500 transition">查看作品</Link>
        <Link href="/warranty" className="border border-brand-blue px-6 py-3 rounded-lg hover:bg-brand-blue transition">登記保固</Link>
      </motion.div>
    </section>
  )
}

