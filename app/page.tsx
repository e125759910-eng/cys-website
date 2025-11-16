import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-neutral-900">近期案例展示</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-[rgba(209,213,219,0.70)] bg-white/60 hover:bg-white/70 transition shadow-silver-glow text-neutral-800">案例 1</div>
          <div className="p-6 rounded-xl border border-[rgba(209,213,219,0.70)] bg-white/60 hover:bg-white/70 transition shadow-silver-glow text-neutral-800">案例 2</div>
          <div className="p-6 rounded-xl border border-[rgba(209,213,219,0.70)] bg-white/60 hover:bg-white/70 transition shadow-silver-glow text-neutral-800">案例 3</div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
