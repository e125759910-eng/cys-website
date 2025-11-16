import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WarrantyForm from "@/components/WarrantyForm";

export default function WarrantyPage(){
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-16 px-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-neutral-100">電子保固登記</h1>
        <p className="text-center text-neutral-400 mb-6">為你的產品啟用保固服務</p>
        <WarrantyForm />
      </section>
      <Footer />
    </main>
  )
}

