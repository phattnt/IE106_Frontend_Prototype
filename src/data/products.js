const baseProducts = [
  {
    name: 'Camera Optic Pro X1',
    category: 'Đồ điện tử',
    skuPrefix: 'OPX',
    sold: 1240,
    stock: 142,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Tai nghe Sonic Wireless',
    category: 'Phụ kiện',
    skuPrefix: 'SNW',
    sold: 856,
    stock: 85,
    imageUrl: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Máy ảnh Retro Snap',
    category: 'Đồ điện tử',
    skuPrefix: 'RSI',
    sold: 412,
    stock: 8,
    imageUrl: 'https://images.pexels.com/photos/3925875/pexels-photo-3925875.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Đồng hồ Timepiece M1',
    category: 'Đồng hồ',
    skuPrefix: 'TMS',
    sold: 198,
    stock: 211,
    imageUrl: 'https://images.unsplash.com/photo-1633451238042-85d93d267866?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Đèn bàn Lumina',
    category: 'Phụ kiện',
    skuPrefix: 'LDL',
    sold: 56,
    stock: 0,
    imageUrl: 'https://images.pexels.com/photos/19844043/pexels-photo-19844043.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    name: 'Loa Bluetooth Vibe',
    category: 'Đồ điện tử',
    skuPrefix: 'VBK',
    sold: 329,
    stock: 54,
    imageUrl: 'https://images.unsplash.com/photo-1545752671-9a296b3100f8?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Chuột Aurora Pro',
    category: 'Phụ kiện',
    skuPrefix: 'AUR',
    sold: 618,
    stock: 77,
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Bàn phím Nova Keys',
    category: 'Phụ kiện',
    skuPrefix: 'NVK',
    sold: 442,
    stock: 23,
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Webcam Streamline C2',
    category: 'Đồ điện tử',
    skuPrefix: 'WSC',
    sold: 221,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=900',
  },
  {
    name: 'Microphone Echo Pod',
    category: 'Phụ kiện',
    skuPrefix: 'MEP',
    sold: 387,
    stock: 61,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=900',
  },
]

export const products = Array.from({ length: 20 }, (_, index) => {
  const template = baseProducts[index % baseProducts.length]
  const stockValue = Math.max(template.stock - (index % 5) * 3, 0)

  return {
    name: `${template.name}${index >= baseProducts.length ? ` ${index + 1}` : ''}`,
    sku: `#${template.skuPrefix}-${String(200 + index).padStart(3, '0')}-${String.fromCharCode(65 + (index % 26))}`,
    sold: (template.sold + index * 17).toLocaleString('en-US'),
    stock: `${stockValue}`,
    stockTone: stockValue === 0 ? 'text-red-600' : stockValue <= 12 ? 'text-orange-500' : 'text-emerald-600',
    category: template.category,
    imageUrl: template.imageUrl,
    variants: [
      {
        id: `${template.skuPrefix}-${index + 1}`,
        name: 'Mặc định',
        price: `${(template.sold % 900 + 199) * 1000}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ',
      },
    ],
  }
})
