import { Icon } from './Icon.jsx'

function ProductImage({ onDelete, product }) {
  return (
    <div className="product-thumb relative aspect-[4/3] overflow-hidden rounded-t-[18px]">
      <img alt={product.name} className="h-full w-full object-cover" loading="lazy" src={product.imageUrl} />
      <button
        aria-label={`Xóa ${product.name}`}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rose-600 opacity-0 shadow-[0_14px_28px_rgba(15,23,42,0.18)] backdrop-blur transition hover:bg-rose-600 hover:text-white group-hover/product:opacity-100 focus:opacity-100"
        onClick={onDelete}
        type="button"
      >
        <Icon className="text-[19px]" name="delete" />
      </button>
    </div>
  )
}

export function ProductCard({ onDelete, product }) {
  return (
    <article className="glass-card group/product flex h-full flex-col overflow-hidden rounded-[18px]">
      <ProductImage onDelete={onDelete} product={product} />
      <div className="flex flex-1 flex-col p-4">
        <h2 className="product-card-title text-base font-bold leading-tight text-slate-950">{product.name}</h2>
        <p className="mt-1.5 text-xs font-normal text-slate-600">SKU: {product.sku}</p>

        <div className="mt-auto grid grid-cols-2 gap-2.5 pt-3">
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
