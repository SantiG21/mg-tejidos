/* ════════════════════════════════════════════════════════
   MG Tejidos — app.js
   "Puntos de amor en cada hilo"
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   CONFIGURACIÓN
   ✏️  Cambia WA_NUMBER por el número real de WhatsApp
   Formato: código de país + número sin espacios ni '+'
   Ejemplo Colombia: 573141234567
════════════════════════════════════════════════════════ */
const WA_NUMBER  = '573204932926'
const WA_MESSAGE = encodeURIComponent('¡Hola! Vi su catálogo en la página y me interesa hacer un pedido 🌸')
const WA_URL     = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`


/* ════════════════════════════════════════════════════════
   DATOS — PRODUCTOS
   Para agregar un producto: copia un objeto y cambia los valores.
   Categorías disponibles: flores | ramos | maceticas | llaveros | amigurumis
   Badges disponibles:      'favorito' | 'nuevo' | '' (ninguno)
════════════════════════════════════════════════════════ */
const products = [
  {
    id:    'tulipan',
    name:  'Tulipán tejido',
    desc:  'Tulipán en crochet con tallo y hojas. Disponible en varios colores.',
    price: 18000,
    cat:   'flores',
    emoji: '🌷',
    bg:    '#FBE9EC',
    badge: 'favorito',
  },
  {
    id:    'girasol',
    name:  'Girasol tejido',
    desc:  'Girasol grande con pétalos detallados. Ideal para regalar.',
    price: 20000,
    cat:   'flores',
    emoji: '🌻',
    bg:    '#FDF5DC',
    badge: 'nuevo',
  },
  {
    id:    'rosa',
    name:  'Rosa tejida',
    desc:  'Rosa clásica en crochet, eterna y sin marchitarse. ¡Perfecta para regalar!',
    price: 18000,
    cat:   'flores',
    emoji: '🌹',
    bg:    '#FBE9EC',
    badge: '',
  },
  {
    id:    'ramo-mixto',
    name:  'Ramo tejido mixto',
    desc:  'Ramo de flores mixtas tejidas, personalizable en colores y tamaño.',
    price: 65000,
    cat:   'ramos',
    emoji: '💐',
    bg:    '#DFF0DF',
    badge: 'favorito',
  },
  {
    id:    'ramo-girasoles',
    name:  'Ramo de girasoles',
    desc:  'Ramo con 5 girasoles tejidos, perfecto para decoración o regalo.',
    price: 75000,
    cat:   'ramos',
    emoji: '🌻',
    bg:    '#FDF5DC',
    badge: '',
  },
  {
    id:    'macetica',
    name:  'Macetica tejida',
    desc:  'Maceta en crochet con diseños geométricos. Incluye planta artificial.',
    price: 35000,
    cat:   'maceticas',
    emoji: '🪴',
    bg:    '#FDE8DC',
    badge: '',
  },
  {
    id:    'llavero-animalito',
    name:  'Llavero animalito',
    desc:  'Llavero tejido con diseños de gatitos, osos, conejos y más a elegir.',
    price: 12000,
    cat:   'llaveros',
    emoji: '🐱',
    bg:    '#F0EBF8',
    badge: '',
  },
  {
    id:    'llavero-mariposa',
    name:  'Llavero mariposa',
    desc:  'Llavero con mariposa tejida, colores a escoger. Muy delicado.',
    price: 12000,
    cat:   'llaveros',
    emoji: '🦋',
    bg:    '#E3EEF8',
    badge: 'nuevo',
  },
  {
    id:    'amigurumi-muneca',
    name:  'Amigurumi muñequita',
    desc:  'Muñequita tejida con atuendo personalizable. ¡Única y especial!',
    price: 45000,
    cat:   'amigurumis',
    emoji: '🧸',
    bg:    '#FBE9EC',
    badge: 'nuevo',
  },
  {
    id:    'amigurumi-animal',
    name:  'Amigurumi animalito',
    desc:  'Pollito, conejito, osito y más. Perfectos para bebés y niños.',
    price: 38000,
    cat:   'amigurumis',
    emoji: '🐣',
    bg:    '#FDF5DC',
    badge: '',
  },
]


/* ════════════════════════════════════════════════════════
   UTILIDADES
════════════════════════════════════════════════════════ */

/**
 * Formatea un número como precio en pesos colombianos.
 * Ejemplo: 18000 → "$18.000"
 */
const formatPrice = (amount) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)

/**
 * Genera la URL de WhatsApp con el nombre del producto en el mensaje.
 */
const productWaUrl = (name) => {
  const msg = encodeURIComponent(`¡Hola! Me interesa el producto: *${name}* 🌸\n¿Está disponible?`)
  return `https://wa.me/${WA_NUMBER}?text=${msg}`
}

/**
 * Construye el HTML de una tarjeta de producto.
 */
const buildProductCard = (p) => {
  const badgeHTML =
    p.badge === 'favorito' ? '<span class="badge badge-fav">⭐ Favorito</span>' :
    p.badge === 'nuevo'    ? '<span class="badge badge-new">Nuevo</span>'       : ''

  return `
    <article class="product-card">
      <div class="product-img" style="background:${p.bg}">
        <span role="img" aria-label="${p.name}">${p.emoji}</span>
        ${badgeHTML}
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-foot">
          <span class="product-price">${formatPrice(p.price)}</span>
          <a href="${productWaUrl(p.name)}"
             target="_blank"
             rel="noopener noreferrer"
             class="pedir-btn">Pedir</a>
        </div>
      </div>
    </article>
  `
}


/* ════════════════════════════════════════════════════════
   CATÁLOGO — Render y filtrado
════════════════════════════════════════════════════════ */
const productsGrid = document.getElementById('productsGrid')

/**
 * Renderiza los productos filtrados por categoría.
 * @param {string} cat — 'todos' o un id de categoría
 */
const renderProducts = (cat) => {
  const list = cat === 'todos'
    ? products
    : products.filter((p) => p.cat === cat)

  productsGrid.innerHTML = list.length
    ? list.map(buildProductCard).join('')
    : '<p style="grid-column:1/-1;text-align:center;font-style:italic;color:#7A5C5C;padding:3rem 0;">No hay productos en esta categoría aún.</p>'
}

// Render inicial
renderProducts('todos')

// Filtros de categoría
document.getElementById('catsBar').addEventListener('click', (e) => {
  const btn = e.target.closest('.cat-btn')
  if (!btn) return
  document.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'))
  btn.classList.add('active')
  renderProducts(btn.dataset.cat)
})


/* ════════════════════════════════════════════════════════
   WHATSAPP — Todos los botones/links con .wa-cta
════════════════════════════════════════════════════════ */
document.querySelectorAll('.wa-cta').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault()
    window.open(WA_URL, '_blank', 'noopener,noreferrer')
  })
})


/* ════════════════════════════════════════════════════════
   MENÚ HAMBURGUESA (móvil)
════════════════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobileMenu')

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open')
})

// Cerrar el menú al hacer clic en cualquier link interno
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open')
  })
})
