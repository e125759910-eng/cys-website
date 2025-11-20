import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";

// 直接用 TypeScript 資料
import { works } from "@/data/works";

export default function PortfolioPage() {

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CYS 作品集
          </h1>

          <div className="w-16 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFF4A0] to-[#FFD700] mb-4" />

          <p className="text-neutral-400 text-lg">
            精選客案，展現科技質感與專業品牌溫度
          </p>
        </div>

        {/* 直接使用 TypeScript 資料 */}
        <PortfolioGrid items={works} />
      </section>
      <Footer />
    </main>
  );
}

