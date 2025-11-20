import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";

export default async function PortfolioPage() {
  // 取得 Base URL（本地與 Vercel 都可用）
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const res = await fetch(`${baseUrl}/data/works.json`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FDF700] via-[#FF6440] to-[#FF0700]">
            CYS 作品集
          </h1>

          <div className="w-16 h-1.5 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#FDF700] to-transparent shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-4"></div>
          <p className="text-neutral-400 text-lg">
            精選案例 · 展現科技與品牌質感
          </p>
        </div>

        {/* 使用 JSON 資料 */}
        <PortfolioGrid items={data.works} />
      </section>
      <Footer />
    </main>
  );
}

