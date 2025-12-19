import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "聯絡我們",
  description: "聯絡 CYS，我們樂意與您交流合作。地址：高雄市仁武區京富路161號，電話：0908229151",
  keywords: ["CYS 聯絡", "包膜服務聯絡", "車體包膜地址", "包膜電話"],
};

export default function ContactPage(){
  const address = "高雄市仁武區京富路161號";
  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2 text-neutral-100">聯絡我們</h1>
            <p className="text-neutral-400 mb-8">我們樂意與你交流合作</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 聯絡資訊區塊 */}
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-neutral-100 mb-4">聯絡資訊</h2>
                
                <div className="space-y-4 text-neutral-300">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-medium text-neutral-200">電話</p>
                      <a 
                        href="tel:0908229151" 
                        className="text-[#FFD700] hover:text-[#FFE44D] transition-colors"
                      >
                        0908229151
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-medium text-neutral-200">Email</p>
                      <a 
                        href="mailto:e125759910@gmail.com" 
                        className="text-[#FFD700] hover:text-[#FFE44D] transition-colors break-all"
                      >
                        e125759910@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-200">地址</p>
                      <p className="text-neutral-300">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-neutral-300"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-200">Instagram</p>
                      <a 
                        href="https://www.instagram.com/stt.wrap" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFD700] hover:text-[#FFE44D] transition-colors"
                      >
                        @stt.wrap
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-neutral-300"
                      >
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.27l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.037.25-.14 1.02.981.56 1.076-.447 5.764-3.398 7.8-5.72 1.063-.91 1.908-1.885 2.607-2.967.417-.65.768-1.33 1.048-2.03.465-1.16.73-2.38.73-3.632"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-200">LINE</p>
                      <a 
                        href="https://line.me/ti/p/@sttwrap" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFD700] hover:text-[#FFE44D] transition-colors"
                      >
                        @sttwrap
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps 嵌入區塊 */}
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-2xl font-semibold text-neutral-100">位置</h2>
                </div>
                <div className="relative w-full h-[500px] md:h-[600px]">
                  <iframe
                    src={googleMapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                    title="Google Maps - 高雄市仁武區京富路161號"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

