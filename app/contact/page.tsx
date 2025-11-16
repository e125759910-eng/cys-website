import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage(){
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-24 text-center px-6">
        <h1 className="text-4xl font-bold mb-2 text-neutral-100">聯絡 CYS</h1>
        <p className="text-neutral-400 mb-8">我們樂意與你交流合作</p>
        <div className="max-w-xl mx-auto text-left space-y-3 text-neutral-300 bg-white/5 border border-white/10 rounded-xl p-6">
          <p>📧 info@cys-style.com</p>
          <p>📞 02-1234-5678</p>
          <p>🏢 台北市信義區時尚大道 88 號</p>
        </div>
      </section>
      <Footer />
    </main>
  )
}

