((scanLabel = 'page') => {
  const MIN_NORMAL = 4.5
  const MIN_LARGE = 3
  const WHITE = { r: 255, g: 255, b: 255, a: 1 }

  function uniqueSelector(el) {
    if (!el || el.nodeType !== 1) return ''
    if (el.id) return `#${el.id}`

    const parts = []
    let current = el
    while (current && current.nodeType === 1 && current !== document.body && parts.length < 5) {
      let part = current.tagName.toLowerCase()
      const classNames = Array.from(current.classList || [])
        .filter((name) => !name.includes(':') && !name.includes('[') && !name.includes('/'))
        .slice(0, 3)
      if (classNames.length) part += `.${classNames.join('.')}`

      const parent = current.parentElement
      if (parent) {
        const sameTag = Array.from(parent.children).filter((child) => child.tagName === current.tagName)
        if (sameTag.length > 1) part += `:nth-of-type(${sameTag.indexOf(current) + 1})`
      }

      parts.unshift(part)
      current = parent
    }
    return parts.join(' > ')
  }

  function clamp(value, min = 0, max = 255) {
    return Math.min(max, Math.max(min, value))
  }

  function parseColor(value) {
    if (!value || value === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }

    const rgb = value.match(/rgba?\(([^)]+)\)/i)
    if (!rgb) return { r: 0, g: 0, b: 0, a: 0 }

    const parts = rgb[1]
      .split(/[,\s/]+/)
      .map((part) => part.trim())
      .filter(Boolean)

    const channels = parts.slice(0, 3).map((part) => {
      if (part.endsWith('%')) return clamp((Number.parseFloat(part) / 100) * 255)
      return clamp(Number.parseFloat(part))
    })

    let alpha = parts[3] === undefined ? 1 : Number.parseFloat(parts[3])
    if (Number.isNaN(alpha)) alpha = 1

    return {
      r: channels[0] || 0,
      g: channels[1] || 0,
      b: channels[2] || 0,
      a: Math.min(1, Math.max(0, alpha)),
    }
  }

  function colorToCss(color) {
    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`
  }

  function blend(fg, bg) {
    const alpha = fg.a + bg.a * (1 - fg.a)
    if (alpha <= 0) return { r: 0, g: 0, b: 0, a: 0 }

    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
      a: alpha,
    }
  }

  function extractGradientColor(backgroundImage) {
    if (!backgroundImage || backgroundImage === 'none') return null

    const matches = backgroundImage.match(/rgba?\([^)]+\)/gi)
    if (!matches || matches.length === 0) return null

    const colors = matches.map(parseColor).filter((color) => color.a > 0)
    if (!colors.length) return null

    return colors.reduce(
      (result, color) => ({
        r: result.r + color.r / colors.length,
        g: result.g + color.g / colors.length,
        b: result.b + color.b / colors.length,
        a: result.a + color.a / colors.length,
      }),
      { r: 0, g: 0, b: 0, a: 0 },
    )
  }

  function effectiveBackground(element) {
    const stack = []
    let current = element

    while (current && current.nodeType === 1) {
      stack.unshift(current)
      current = current.parentElement
    }

    let bg = WHITE
    for (const item of stack) {
      const style = getComputedStyle(item)
      const color = parseColor(style.backgroundColor)
      const gradient = extractGradientColor(style.backgroundImage)

      if (color.a > 0) bg = blend(color, bg)
      if (gradient && gradient.a > 0) bg = blend(gradient, bg)
    }

    return bg
  }

  function luminance(color) {
    const convert = (channel) => {
      const normalized = channel / 255
      return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
    }

    return 0.2126 * convert(color.r) + 0.7152 * convert(color.g) + 0.0722 * convert(color.b)
  }

  function contrastRatio(fg, bg) {
    const lighter = Math.max(luminance(fg), luminance(bg))
    const darker = Math.min(luminance(fg), luminance(bg))
    return (lighter + 0.05) / (darker + 0.05)
  }

  function isVisibleElement(element) {
    if (!element || element.closest('.material-symbols-outlined')) return false

    let current = element
    while (current && current.nodeType === 1) {
      const style = getComputedStyle(current)
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        Number.parseFloat(style.opacity || '1') <= 0.02 ||
        current.getAttribute('aria-hidden') === 'true'
      ) {
        return false
      }
      current = current.parentElement
    }

    return true
  }

  function isLargeText(style) {
    const size = Number.parseFloat(style.fontSize || '16')
    const weightValue = style.fontWeight === 'bold' ? 700 : Number.parseInt(style.fontWeight, 10)
    const weight = Number.isNaN(weightValue) ? 400 : weightValue
    return size >= 24 || (size >= 18.66 && weight >= 700)
  }

  function textNodes(root) {
    const nodes = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = node.nodeValue.replace(/\s+/g, ' ').trim()
        if (!text) return NodeFilter.FILTER_REJECT
        if (!isVisibleElement(node.parentElement)) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    })

    while (walker.nextNode()) nodes.push(walker.currentNode)
    return nodes
  }

  const failures = []
  const passing = []

  for (const node of textNodes(document.body)) {
    const element = node.parentElement
    const range = document.createRange()
    range.selectNodeContents(node)
    const rects = Array.from(range.getClientRects()).filter((rect) => rect.width > 1 && rect.height > 1)
    range.detach()

    if (!rects.length) continue

    const style = getComputedStyle(element)
    const bg = effectiveBackground(element)
    const fg = blend(parseColor(style.color), bg)
    const ratio = contrastRatio(fg, bg)
    const minRatio = isLargeText(style) ? MIN_LARGE : MIN_NORMAL
    const entry = {
      background: colorToCss(bg),
      color: colorToCss(fg),
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      ratio: Number(ratio.toFixed(2)),
      required: minRatio,
      selector: uniqueSelector(element),
      text: node.nodeValue.replace(/\s+/g, ' ').trim().slice(0, 90),
    }

    if (ratio + 0.01 < minRatio) {
      failures.push(entry)
    } else {
      passing.push(entry)
    }
  }

  failures.sort((a, b) => a.ratio - b.ratio)

  return {
    checked: failures.length + passing.length,
    failures: failures.slice(0, 80),
    label: scanLabel,
    minRatio: failures.length ? failures[0].ratio : null,
    passed: passing.length,
    url: window.location.href,
  }
})()
