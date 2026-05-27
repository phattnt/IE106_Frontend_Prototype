import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DropdownSelect } from '../components/DropdownSelect.jsx'
import { Icon } from '../components/Icon.jsx'
import { Pagination } from '../components/Pagination.jsx'
import { ProductCard } from '../components/ProductCard.jsx'
import { products as initialProducts } from '../data/products.js'

const categoryOptions = [
  { label: 'Tất cả sản phẩm', value: 'all' },
  { label: 'Áo', value: 'Áo' },
  { label: 'Quần', value: 'Quần' },
  { label: 'Đồng hồ', value: 'Đồng hồ' },
  { label: 'Đồ điện tử', value: 'Đồ điện tử' },
  { label: 'Phụ kiện', value: 'Phụ kiện' },
]

const productCategoryOptions = categoryOptions.filter((option) => option.value !== 'all')

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getResponsivePageSize(container) {
  if (!container || typeof window === 'undefined') {
    return 8
  }

  const gap = 20
  const minCardWidth = window.innerWidth <= 1366 ? 190 : 210
  const estimatedCardHeight = window.innerWidth <= 1366 ? 270 : 292
  const containerWidth = container.clientWidth
  const topOffset = container.getBoundingClientRect().top
  const paginationReserve = 112
  const bottomReserve = 28
  const availableHeight = Math.max(360, window.innerHeight - topOffset - paginationReserve - bottomReserve)
  const columns = Math.max(1, Math.floor((containerWidth + gap) / (minCardWidth + gap)))
  const rows = clamp(Math.floor((availableHeight + gap) / (estimatedCardHeight + gap)), 2, 4)

  return clamp(columns * rows, 4, 20)
}

function AddProductModal({ onClose, onSave, showToast }) {
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('0')
  const [variants, setVariants] = useState([{ id: 1, name: 'L / Đen Nhám', price: '1200000' }])
  const [imagePreview, setImagePreview] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function addVariant() {
    setVariants((current) => [
      ...current,
      { id: Date.now(), name: '', price: '' },
    ])
  }

  function updateVariant(id, field, value) {
    setVariants((current) =>
      current.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant))
    )
  }

  function removeVariant(id) {
    setVariants((current) => current.filter((variant) => variant.id !== id))
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Chỉ hỗ trợ JPG, PNG hoặc WEBP')
      showToast?.({
        message: 'Chỉ hỗ trợ định dạng JPG, PNG hoặc WEBP.',
        title: 'Ảnh không hợp lệ',
        tone: 'error',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ảnh không được vượt quá 5MB')
      showToast?.({
        message: 'Dung lượng ảnh vượt quá giới hạn 5MB.',
        title: 'Ảnh quá lớn',
        tone: 'error',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setUploadError('')
      setImagePreview(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    const cleanedName = productName.trim()
    const stockValue = Number.parseInt(stock, 10)
    const cleanedVariants = variants
      .map((variant) => ({
        ...variant,
        name: variant.name.trim(),
        price: variant.price.trim(),
      }))
      .filter((variant) => variant.name && variant.price)

    if (!cleanedName) {
      setFormError('Cần nhập tên sản phẩm')
      showToast?.({ message: 'Vui lòng nhập tên sản phẩm trước khi lưu.', title: 'Thiếu tên sản phẩm', tone: 'error' })
      return
    }

    if (!category) {
      setFormError('Cần chọn danh mục')
      showToast?.({ message: 'Vui lòng chọn danh mục cho sản phẩm.', title: 'Thiếu danh mục', tone: 'error' })
      return
    }

    if (Number.isNaN(stockValue) || stockValue < 0) {
      setFormError('Số lượng trong kho không hợp lệ')
      showToast?.({ message: 'Số lượng tồn kho phải là số không âm.', title: 'Số lượng không hợp lệ', tone: 'error' })
      return
    }

    if (!imagePreview) {
      setFormError('Cần tải ảnh sản phẩm')
      showToast?.({ message: 'Vui lòng tải ảnh để nhận diện sản phẩm trong danh mục.', title: 'Thiếu ảnh sản phẩm', tone: 'error' })
      return
    }

    if (cleanedVariants.length === 0) {
      setFormError('Cần ít nhất một biến thể hợp lệ')
      showToast?.({ message: 'Cần ít nhất một biến thể có tên và giá bán.', title: 'Thiếu biến thể', tone: 'error' })
      return
    }

    setFormError('')
    onSave({
      category,
      imageUrl: imagePreview,
      name: cleanedName,
      stock: stockValue,
      variants: cleanedVariants,
    })
  }

  return createPortal(
    <div
      className="motion-overlay fixed inset-0 z-[260] flex items-center justify-center bg-slate-950/42 px-4 py-8 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-label="Thêm sản phẩm mới"
        aria-modal="true"
        className="motion-modal relative max-h-[92vh] w-full max-w-[900px] overflow-y-auto rounded-[24px] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="flex items-start justify-between border-b border-slate-900/8 px-8 py-7">
          <div>
            <h2 className="text-[24px] font-bold text-slate-950">Thêm sản phẩm mới</h2>
            <p className="mt-2 text-[15px] text-slate-500">Nhập thông tin chi tiết để thêm sản phẩm vào hệ thống</p>
          </div>
          <button
            className="motion-button flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8 px-8 py-8 lg:grid-cols-[260px_1fr]">
          <section>
            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600">Hình ảnh sản phẩm</p>
            <label className="motion-button mt-5 flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[18px] border-2 border-dashed border-slate-300 bg-slate-100/70 text-center hover:border-slate-400 hover:bg-slate-100">
              {imagePreview ? (
                <img alt="Preview sản phẩm" className="h-full w-full object-cover" src={imagePreview} />
              ) : (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                    <Icon className="text-[24px]" name="add_a_photo" />
                  </span>
                  <span className="mt-4 text-sm font-semibold text-slate-700">Tải ảnh lên</span>
                  <span className="mt-2 px-4 text-xs text-slate-400">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)</span>
                </>
              )}
              <input accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleImageUpload} type="file" />
            </label>
            {imagePreview ? (
              <button
                className="motion-button mt-3 text-sm font-semibold text-slate-700 hover:text-slate-900"
                onClick={() => setImagePreview('')}
                type="button"
              >
                Chọn ảnh khác
              </button>
            ) : null}
            {uploadError ? <p className="mt-3 text-sm font-semibold text-red-600">{uploadError}</p> : null}
          </section>

          <section className="space-y-5">
            <div>
              <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600" htmlFor="product-name">
                Tên sản phẩm
              </label>
              <input
                className="h-12 w-full rounded-[18px] border border-transparent bg-slate-100 px-5 text-[15px] font-medium text-slate-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-300/40"
                id="product-name"
                onChange={(event) => setProductName(event.target.value)}
                placeholder="Ví dụ: Camera Sony Alpha A7 IV"
                type="text"
                value={productName}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600">Danh mục</p>
                <DropdownSelect
                  className="w-full max-w-[264px]"
                  onChange={setCategory}
                  options={productCategoryOptions}
                  placeholder="Chọn danh mục"
                  triggerClassName="border-transparent bg-slate-100 text-slate-800 shadow-none focus:border-slate-300 focus:bg-white"
                  theme="gray"
                  value={category}
                />
              </div>

              <div>
                <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600" htmlFor="product-stock">
                  Số lượng trong kho
                </label>
                <input
                  className="h-11 w-full rounded-2xl border border-transparent bg-slate-100 px-5 text-[15px] font-medium text-slate-800 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-300/40"
                  id="product-stock"
                  onChange={(event) => setStock(event.target.value)}
                  type="number"
                  value={stock}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600">Biến thể sản phẩm</p>
              <div className="space-y-3">
                {variants.map((variant) => (
                  <article className="grid grid-cols-[1fr_160px_32px] items-center gap-3 rounded-[18px] bg-slate-100 px-4 py-3" key={variant.id}>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400">Kích thước / Màu sắc</p>
                      <input
                        className="mt-1 w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                        onChange={(event) => updateVariant(variant.id, 'name', event.target.value)}
                        placeholder="Ví dụ: L / Đen Nhám"
                        type="text"
                        value={variant.name}
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase text-slate-400">Giá bán</p>
                      <input
                        className="mt-1 w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
                        onChange={(event) => updateVariant(variant.id, 'price', event.target.value)}
                        placeholder="Ví dụ: 1200000"
                        type="text"
                        value={variant.price}
                      />
                    </div>
                    <button
                      className="motion-button flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-white hover:text-slate-700"
                      onClick={() => removeVariant(variant.id)}
                      type="button"
                    >
                      <Icon className="text-[18px]" name="delete" />
                    </button>
                  </article>
                ))}

                <button
                  className="motion-button flex h-12 w-full items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-slate-300 text-sm font-bold text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900"
                  onClick={addVariant}
                  type="button"
                >
                  <Icon className="text-[18px]" name="add" />
                  Thêm biến thể mới
                </button>
              </div>
            </div>

            {formError ? <p className="text-sm font-semibold text-red-600">{formError}</p> : null}
          </section>
        </div>

        <footer className="flex items-center justify-end gap-4 border-t border-slate-900/8 px-8 py-6">
          <button className="motion-button h-11 rounded-2xl px-6 text-sm font-bold text-slate-600 hover:bg-slate-50" onClick={onClose} type="button">
            Hủy
          </button>
          <button
            className="motion-button h-11 rounded-full bg-blue-700 px-8 text-sm font-bold text-white shadow-[0_14px_28px_rgba(37,99,235,0.28)] hover:bg-blue-800"
            onClick={handleSubmit}
            type="button"
          >
            Lưu sản phẩm
          </button>
        </footer>
      </div>
    </div>,
    document.body
  )
}

function buildSkuFromName(name, index) {
  const letters = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X')

  return `#${letters}-${String(500 + index).padStart(3, '0')}-N`
}

export function ProductPage({ showToast }) {
  const productGridRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [productRows, setProductRows] = useState(initialProducts)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const filteredProducts =
    selectedCategory === 'all'
      ? productRows
      : productRows.filter((product) => product.category === selectedCategory)
  const totalItems = filteredProducts.length
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1)
  const visibleProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    function updatePageSize() {
      const nextSize = getResponsivePageSize(productGridRef.current)
      setItemsPerPage((current) => (current === nextSize ? current : nextSize))
    }

    updatePageSize()

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updatePageSize) : null

    if (productGridRef.current && resizeObserver) {
      resizeObserver.observe(productGridRef.current)
    }

    window.addEventListener('resize', updatePageSize)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updatePageSize)
    }
  }, [])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  function handleAddProduct(payload) {
    const stockTone = payload.stock === 0 ? 'text-red-600' : payload.stock <= 12 ? 'text-orange-500' : 'text-emerald-600'
    const nextProduct = {
      category: payload.category,
      imageUrl: payload.imageUrl,
      name: payload.name,
      sku: buildSkuFromName(payload.name, productRows.length + 1),
      sold: '0',
      stock: `${payload.stock}`,
      stockTone,
      variants: payload.variants.map((variant, index) => ({
        ...variant,
        id: `${Date.now()}-${index}`,
      })),
    }

    setProductRows((current) => [nextProduct, ...current])
    setCurrentPage(1)
    setSelectedCategory('all')
    setShowAddModal(false)
    showToast?.({
      message: `${payload.name} đã được thêm vào danh mục sản phẩm.`,
      title: 'Thêm sản phẩm thành công',
      tone: 'success',
    })
  }

  return (
    <>
      <div className="product-page space-y-6 pb-6">
        <section className="glass-panel rounded-[30px] p-6 lg:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h1 className="page-header-title">Danh mục sản phẩm</h1>
              <p className="page-header-subtitle">Quản lý và tra cứu thông tin sản phẩm để đóng gói chính xác.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DropdownSelect
                align="right"
                className="w-56 shrink-0"
                menuWidth={224}
                onChange={(value) => {
                  setSelectedCategory(value)
                  setCurrentPage(1)
                }}
                options={categoryOptions}
                value={selectedCategory}
              />
              <button
                className="motion-button flex h-11 items-center gap-2 rounded-full bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.28)] hover:bg-blue-800"
                onClick={() => setShowAddModal(true)}
                type="button"
              >
                <Icon className="text-base" name="add" />
                Thêm sản phẩm
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] p-0">
          <div className="product-grid grid gap-5" ref={productGridRef}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            itemLabel="sản phẩm"
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            totalPages={totalPages}
          />
        </section>
      </div>

      {showAddModal ? <AddProductModal onClose={() => setShowAddModal(false)} onSave={handleAddProduct} showToast={showToast} /> : null}
    </>
  )
}
