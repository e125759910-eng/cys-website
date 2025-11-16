import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(236,239,244,0.55))] backdrop-blur border-b border-[rgba(209,213,219,0.60)] text-neutral-800 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="px-3 py-2 rounded-lg bg-black/10 border border-white/40 shadow-sm backdrop-blur-sm">
          <span className="block text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-[linear-gradient(180deg,#f9fafb_0%,#dfe5ee_32%,#a6afba_55%,#e7ebf2_76%,#b9c1cc_100%)] drop-shadow">
            CYS
          </span>
        </div>
      </div>
      <ul className="flex gap-6 text-sm">
        <li><Link href="/" className="hover:text-neutral-900 transition">首頁</Link></li>
        <li><Link href="/portfolio" className="hover:text-neutral-900 transition">作品集</Link></li>
        <li><Link href="/warranty" className="hover:text-neutral-900 transition">電子保固</Link></li>
        <li><Link href="/contact" className="hover:text-neutral-900 transition">聯絡我們</Link></li>
      </ul>
    </nav>
  );
}

