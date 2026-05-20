function ProductImage({ product }) {
  return (
    <div className="product-thumb relative aspect-[4/3] overflow-hidden rounded-t-[18px]">
      <img alt={product.name} className="h-full w-full object-cover" loading="lazy" src={product.imageUrl} />
    </div>
  )
}

export function ProductCard({ product }) {
  return (
    <article className="glass-card overflow-hidden rounded-[18px]">
      <ProductImage product={product} />
      <div className="p-4">
        <h2 className="text-base font-bold leading-tight text-slate-950">{product.name}</h2>
        <p className="mt-1.5 text-xs font-normal text-slate-600">SKU: {product.sku}</p>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-white/35 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Đã bán</p>
            <p className="mt-1 text-sm font-bold text-slate-950">{product.sold}</p>
          </div>
          <div className="rounded-xl bg-white/35 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">Trong kho</p>
            <p className={`mt-1 text-sm font-bold ${product.stockTone}`}>{product.stock}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
