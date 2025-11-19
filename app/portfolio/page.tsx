import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";
import { works } from "@/data/works";

export default function PortfolioPage(){
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFE44D] to-[#FFD700]">
            CYS 作品集
          </h1>
          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-4"></div>
          <p className="text-neutral-400 text-lg">精選案例，展現科技美學與品牌質感</p>
        </div>
        <PortfolioGrid items={works} />
      </section>
      <Footer />
    </main>
  )
}

