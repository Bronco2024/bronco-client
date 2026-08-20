export const PRODUCTS = [
  {
    id: 'roll-white',
    name: 'لحمانية بيضاء',
    desc: 'طازجة يومياً، ناعمة ومناسبة للساندويش',
    unit: 'حبة',
    price: 2.5,
    category: 'rolls',
    image: 'roll-white',
  },
  {
    id: 'roll-sesame',
    name: 'لحمانية سمسم',
    desc: 'محمّصة بسمسم ذهبي من فوق',
    unit: 'حبة',
    price: 3,
    category: 'rolls',
    image: 'roll-sesame',
  },
  {
    id: 'roll-whole',
    name: 'لحمانية قمح كامل',
    desc: 'أخف وأغنى، مثالية للفطور',
    unit: 'حبة',
    price: 3.5,
    category: 'rolls',
    image: 'roll-whole',
  },
  {
    id: 'mort-classic',
    name: 'مرتديلا كلاسيك',
    desc: 'شرائح طرية، جاهزة للتقديم',
    unit: 'علبة 200غ',
    price: 18,
    category: 'mortadella',
    image: 'mort-classic',
  },
  {
    id: 'mort-smoked',
    name: 'مرتديلا مدخّنة',
    desc: 'نكهة دخان خفيفة ومميزة',
    unit: 'علبة 200غ',
    price: 22,
    category: 'mortadella',
    image: 'mort-smoked',
  },
  {
    id: 'mort-pepper',
    name: 'مرتديلا فلفل',
    desc: 'مع حبات فلفل أسود، لمحبين الزبدة',
    unit: 'علبة 200غ',
    price: 24,
    category: 'mortadella',
    image: 'mort-pepper',
  },
  {
    id: 'combo-family',
    name: 'باقة العيلة',
    desc: '8 لحمانيات + مرتديلا كلاسيك',
    unit: 'باقة',
    price: 36,
    category: 'combo',
    image: 'combo',
  },
]

export const DELIVERY_FEE = 8
export const FREE_DELIVERY_FROM = 60

export function formatPrice(n) {
  return `${n.toFixed(n % 1 === 0 ? 0 : 1)} ₪`
}

export function nextDeliveryDays(count = 7) {
  const days = []
  const now = new Date()
  // Start from tomorrow
  for (let i = 1; days.length < count; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const weekday = d.getDay()
    // Closed Fridays (optional business rule)
    if (weekday === 5) continue
    days.push(d)
  }
  return days
}

export function formatDayLabel(date) {
  return new Intl.DateTimeFormat('ar', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function formatDayShort(date) {
  return new Intl.DateTimeFormat('ar', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}
