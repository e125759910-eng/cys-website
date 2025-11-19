import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";
import { works } from "@/data/works";

export default function HomePage() {
  // 顯示前3個作品個案作為近期案例
  const recentWorks = works.slice(0, 3);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* 近期案例展示區 */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFE44D] to-[#FFD700]">
            近期案例展示
          </h2>
          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_15px_rgba(255,215,0,0.5)]"></div>
          <p className="text-neutral-400 mt-6 text-lg">專業包膜技術 · 精緻工藝呈現</p>
        </div>

        <PortfolioGrid items={recentWorks} />
      </section>

      {/* 特色服務區 */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFE44D] to-[#FFD700]">
            專業服務
          </h2>
          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_15px_rgba(255,215,0,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "專業包膜", desc: "頂級膜料，精緻工藝" },
            { title: "品質保證", desc: "CYS台灣總代理" },
            { title: "電子保固", desc: "完整售後服務" },
            { title: "客製化服務", desc: "滿足您的需求" }
          ].map((item, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-[#FFD700]/20 bg-black/30 backdrop-blur-sm hover:border-[#FFD700]/40 hover:bg-black/50 transition-all duration-300 text-center group"
            >
              <div className="text-3xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
