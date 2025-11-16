import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";

const works = [
  { id: 1, title: "未來藍光耳機", img: "/work1.svg" },
  { id: 2, title: "智慧穿戴設計", img: "/work2.svg" },
  { id: 3, title: "品牌數位識別", img: "/work3.svg" },
];

export default function PortfolioPage(){
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-brand-blue">CYS 作品集</h1>
        <PortfolioGrid items={works} />
      </section>
      <Footer />
    </main>
  )
}

