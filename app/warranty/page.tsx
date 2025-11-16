import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WarrantyForm from "@/components/WarrantyForm";

export default function WarrantyPage(){
  return (
    <main className="min-h-screen bg-brand-dark text-white">
      <Navbar />
      <section className="py-16 px-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-brand-blue">電子保固登記</h1>
        <WarrantyForm />
      </section>
      <Footer />
    </main>
  )
}

