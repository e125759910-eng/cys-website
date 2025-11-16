export default function PortfolioGrid({ items }: { items: { id: number; title: string; img: string }[] }){
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map(item => (
        <div key={item.id} className="group relative overflow-hidden rounded-xl border border-[rgba(229,231,235,0.16)] bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.06] transition shadow-silver-glow">
          <img src={item.img} alt={item.title} className="w-full h-64 object-cover opacity-95 group-hover:opacity-100 transition" />
          <div className="absolute bottom-0 left-0 w-full bg-black/40 border-t border-white/10 backdrop-blur text-center py-3 text-[rgb(229,231,235)]">{item.title}</div>
        </div>
      ))}
    </div>
  )
}

