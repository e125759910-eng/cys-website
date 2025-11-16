export default function PortfolioGrid({ items }: { items: { id: number; title: string; img: string }[] }){
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map(item => (
        <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-lg hover:scale-105 transition bg-black/40">
          <img src={item.img} alt={item.title} className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 left-0 w-full bg-black/60 text-center py-3">{item.title}</div>
        </div>
      ))}
    </div>
  )
}

