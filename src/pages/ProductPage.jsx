import { Icon } from '../components/Icon.jsx'
import { ProductCard } from '../components/ProductCard.jsx'
import { products } from '../data/products.js'

export function ProductPage() {
  return (
    <div className="product-page">
      <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-[30px]">
            Danh mục sản phẩm
          </h1>
          <p className="mt-2 max-w-xl text-sm font-normal leading-6 text-slate-600 sm:text-[15px]">
            Quản lý và tra cứu thông tin sản phẩm để đóng gói chính xác.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="glass-control flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-semibold text-slate-700"
            type="button"
          >
            Danh mục
            <Icon name="expand_more" className="text-base" />
          </button>
          <button
            className="flex h-11 items-center gap-2 rounded-full bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.28)] transition hover:bg-blue-800"
            type="button"
          >
            <Icon name="add" className="text-base" />
            Thêm sản phẩm
          </button>
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
        {products.map((product) => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </section>

      <footer className="mt-6 flex flex-col gap-4 pb-6 text-sm font-normal text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>Hiển thị 1-6 trong số 342 sản phẩm</p>
        <div className="flex items-center gap-2">
          <button className="pagination-button opacity-50" type="button">
            Trước
          </button>
          <button className="pagination-button bg-blue-700 text-white shadow-[0_10px_20px_rgba(37,99,235,0.24)]" type="button">
            1
          </button>
          <button className="pagination-button" type="button">
            2
          </button>
          <button className="pagination-button" type="button">
            3
          </button>
          <button className="pagination-button px-5" type="button">
            Sau
          </button>
        </div>
      </footer>
    </div>
  )
}
