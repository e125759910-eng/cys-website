import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WarrantyQueryForm from "@/components/WarrantyQueryForm";

export default function WarrantyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FFE440] to-[#FF8700] bg-clip-text text-transparent">
            保固查詢
          </h1>
          <p className="text-neutral-400 text-lg">
            輸入您的聯絡電話，即可查詢保固資訊
          </p>
        </div>
        <WarrantyQueryForm />
      </section>
      <Footer />
    </main>
  );
}

