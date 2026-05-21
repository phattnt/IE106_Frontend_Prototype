import { useEffect, useState } from 'react'
import { Icon } from './Icon.jsx'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getVisiblePages(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5]
  }

  if (currentPage >= totalPages - 2) {
    return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
}

export function Pagination({
  currentPage,
  itemLabel = 'mục',
  itemsPerPage,
  onPageChange,
  totalItems,
  totalPages,
}) {
  const [jumpPage, setJumpPage] = useState(`${currentPage}`)
  const pageCount = Math.max(1, totalPages)

  useEffect(() => {
    setJumpPage(`${currentPage}`)
  }, [currentPage])

  const visiblePages = getVisiblePages(currentPage, pageCount)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  function goToPage(page) {
    onPageChange(clamp(page, 1, pageCount))
  }

  function handleJumpSubmit(event) {
    event.preventDefault()
    const parsed = Number.parseInt(jumpPage, 10)

    if (Number.isNaN(parsed)) {
      setJumpPage(`${currentPage}`)
      return
    }

    goToPage(parsed)
  }

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-slate-900/12 pt-5 text-sm text-slate-600 xl:flex-row xl:items-center xl:justify-between">
      <p>
        Hiển thị {startItem}-{endItem} trong số {totalItems.toLocaleString('en-US')} {itemLabel}
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="pagination-button motion-button px-4"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
            type="button"
          >
            <Icon className="text-[18px]" name="keyboard_double_arrow_left" />
          </button>
          <button
            className="pagination-button motion-button px-4"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            type="button"
          >
            <Icon className="text-[18px]" name="chevron_left" />
          </button>

          {visiblePages.map((page) => (
            <button
              aria-current={page === currentPage ? 'page' : undefined}
              className={`pagination-button motion-button ${
                page === currentPage ? 'is-active' : ''
              }`}
              key={page}
              onClick={() => goToPage(page)}
              type="button"
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-button motion-button px-4"
            disabled={currentPage === pageCount}
            onClick={() => goToPage(currentPage + 1)}
            type="button"
          >
            <Icon className="text-[18px]" name="chevron_right" />
          </button>
          <button
            className="pagination-button motion-button px-4"
            disabled={currentPage === pageCount}
            onClick={() => goToPage(pageCount)}
            type="button"
          >
            <Icon className="text-[18px]" name="keyboard_double_arrow_right" />
          </button>
        </div>

        <form className="flex items-center gap-2" onSubmit={handleJumpSubmit}>
          <span className="text-sm text-slate-500">Đến trang</span>
          <input
            className="h-10 w-16 rounded-2xl border border-slate-900/12 bg-white/75 px-3 text-center text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            inputMode="numeric"
            onChange={(event) => setJumpPage(event.target.value)}
            type="text"
            value={jumpPage}
          />
          <button className="pagination-button motion-button px-4" type="submit">
            Đi
          </button>
        </form>
      </div>
    </div>
  )
}
