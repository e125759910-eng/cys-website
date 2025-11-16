import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-neutral-100">近期案例展示</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg shadow-lg border border-white/10 bg-white/5 text-neutral-200">案例 1</div>
          <div className="p-6 rounded-lg shadow-lg border border-white/10 bg-white/5 text-neutral-200">案例 2</div>
          <div className="p-6 rounded-lg shadow-lg border border-white/10 bg-white/5 text-neutral-200">案例 3</div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
