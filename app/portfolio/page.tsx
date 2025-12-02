import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";
import { works } from "@/data/works";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CYS 作品集",
  description: "查看 CYS 專業包膜作品集，包含全車改色、消光膜、犀牛皮保護膜等精選案例。展現科技感及專業車體包膜作品。",
  keywords: ["CYS 作品集", "包膜案例", "汽車改色", "車體包膜作品", "包膜實例"],
  openGraph: {
    title: "CYS 作品集 - 專業包膜案例展示",
    description: "查看 CYS 專業包膜作品集，包含全車改色、消光膜、犀牛皮保護膜等精選案例。",
    url: "https://cyswrap.com.tw/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FFE440] to-[#FF8700] bg-clip-text text-transparent">
            CYS 作品集
          </h1>
          <p className="text-neutral-400 text-lg">
            精選案例：展現科技感及專業車體包膜作品
          </p>
        </div>

        {/* 不 fetch，直接用 TS 資料 */}
        <PortfolioGrid items={works} />
      </section>

      <Footer />
    </main>
  );
}
