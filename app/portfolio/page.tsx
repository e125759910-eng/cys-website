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
    <main className="min-h-screen">
      <Navbar />
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center text-neutral-900">CYS 作品集</h1>
        <p className="text-center text-neutral-600 mb-10">精選案例，展現科技美學與品牌質感</p>
        <PortfolioGrid items={works} />
      </section>
      <Footer />
    </main>
  )
}

