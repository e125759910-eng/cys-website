import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function HomePage(){
  return (
    <main className="min-h-screen bg-gradient-tech text-white">
      <Navbar />
      <Hero />
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">精選作品</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <img src="/work1.svg" className="rounded-lg shadow-lg" />
          <img src="/work2.svg" className="rounded-lg shadow-lg" />
          <img src="/work3.svg" className="rounded-lg shadow-lg" />
        </div>
      </section>
      <Footer />
    </main>
  )
}

