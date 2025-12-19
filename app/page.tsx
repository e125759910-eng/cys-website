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
      <Hero />
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">CYS 最新作品</h1>
        <PortfolioGrid items={recentWorks} />
      </section>
      <Footer />
    </main>
  );
}
