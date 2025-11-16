import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage(){
  return (
    <main className="min-h-screen bg-gradient-tech text-white">
      <Navbar />
      <section className="py-24 text-center">
        <h1 className="text-4xl font-bold mb-6">聯絡 CYS</h1>
        <p className="text-lg mb-4">📧 info@cys-style.com</p>
        <p className="text-lg mb-4">📞 02-1234-5678</p>
        <p className="text-lg">🏢 台北市信義區時尚大道 88 號</p>
      </section>
      <Footer />
    </main>
  )
}

