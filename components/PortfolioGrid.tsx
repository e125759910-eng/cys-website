export default function PortfolioGrid({ items }: { items: { id: number; title: string; img: string }[] }){
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map(item => (
        <div key={item.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-lg">
          <img src={item.img} alt={item.title} className="w-full h-64 object-cover opacity-95 group-hover:opacity-100 transition" />
          <div className="absolute bottom-0 left-0 w-full bg-black/50 backdrop-blur text-center py-3 text-neutral-200">{item.title}</div>
        </div>
      ))}
    </div>
  )
}

