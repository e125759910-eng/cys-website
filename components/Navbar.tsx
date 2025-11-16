import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 bg-brand-dark text-white shadow-lg sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="CYS Logo" className="w-36 h-auto" />
      </div>
      <ul className="flex gap-6 text-sm">
        <li><Link href="/">首頁</Link></li>
        <li><Link href="/portfolio">作品集</Link></li>
        <li><Link href="/warranty">電子保固</Link></li>
        <li><Link href="/contact">聯絡我們</Link></li>
      </ul>
    </nav>
  );
}

