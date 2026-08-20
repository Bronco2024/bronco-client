import { createContext, useContext, useEffect, useReducer } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'lahmaniya-cart-v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: {}, deliveryDay: null, customer: null }
    return JSON.parse(raw)
  } catch {
    return { items: {}, deliveryDay: null, customer: null }
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { id, qty = 1 } = action
      const current = state.items[id] || 0
      return { ...state, items: { ...state.items, [id]: current + qty } }
    }
    case 'SET_QTY': {
      const { id, qty } = action
      const next = { ...state.items }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return { ...state, items: next }
    }
    case 'REMOVE': {
      const next = { ...state.items }
      delete next[action.id]
      return { ...state, items: next }
    }
    case 'SET_DAY':
      return { ...state, deliveryDay: action.day }
    case 'SET_CUSTOMER':
      return { ...state, customer: action.customer }
    case 'CLEAR':
      return { items: {}, deliveryDay: null, customer: state.customer }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value = {
    items: state.items,
    deliveryDay: state.deliveryDay,
    customer: state.customer,
    add: (id, qty = 1) => dispatch({ type: 'ADD', id, qty }),
    setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    remove: (id) => dispatch({ type: 'REMOVE', id }),
    setDay: (day) => dispatch({ type: 'SET_DAY', day }),
    setCustomer: (customer) => dispatch({ type: 'SET_CUSTOMER', customer }),
    clear: () => dispatch({ type: 'CLEAR' }),
    count: Object.values(state.items).reduce((a, b) => a + b, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
