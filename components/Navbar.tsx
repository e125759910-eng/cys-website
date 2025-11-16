import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 bg-black/30 backdrop-blur border-b border-white/10 text-neutral-200 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="CYS Logo" className="w-36 h-auto opacity-90" />
      </div>
      <ul className="flex gap-6 text-sm">
        <li><Link href="/" className="hover:text-white transition">首頁</Link></li>
        <li><Link href="/portfolio" className="hover:text-white transition">作品集</Link></li>
        <li><Link href="/warranty" className="hover:text-white transition">電子保固</Link></li>
        <li><Link href="/contact" className="hover:text-white transition">聯絡我們</Link></li>
      </ul>
    </nav>
  );
}

