import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PortfolioGrid from "@/components/PortfolioGrid";
import { works } from "@/data/works";

export default function Home() {
  const recentWorks = works.slice(0, 3);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero 區域 */}
      <Hero />

      {/* 近期案例展示 */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FFE440] to-[#FF8700] bg-clip-text text-transparent">
            近期案例展示
          </h2>
          <p className="text-neutral-400 text-lg">
            專業包膜技術 · 精緻工藝呈現
          </p>
        </div>
        <PortfolioGrid items={recentWorks} />
      </section>

      {/* 專業服務 */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FFE440] to-[#FF8700] bg-clip-text text-transparent">
            專業服務
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden rounded-xl border border-[#FFD700]/30 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-[#FFD700]/50 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,215,0,0.1),0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-gold-glow p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-2">專業包膜</h3>
              <p className="text-neutral-400 text-xs">頂級膜料，精緻工藝</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-xl border border-[#FFD700]/30 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-[#FFD700]/50 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,215,0,0.1),0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-gold-glow p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-2">品質保證</h3>
              <p className="text-neutral-400 text-xs">CYS 台灣總代理</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-xl border border-[#FFD700]/30 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-[#FFD700]/50 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,215,0,0.1),0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-gold-glow p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-2">電子保固</h3>
              <p className="text-neutral-400 text-xs">完整售後服務</p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-xl border border-[#FFD700]/30 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-[#FFD700]/50 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,215,0,0.1),0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-gold-glow p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-3">✨</div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-2">客製化服務</h3>
              <p className="text-neutral-400 text-xs">滿足您的需求</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
