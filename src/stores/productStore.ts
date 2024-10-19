import { create } from 'zustand';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

interface ProductStore {
  products: Product[];
  searchProducts: (term: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateStock: (id: string, newStock: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [
    { id: '1', name: 'Apple', category: 'Fruit', price: 0.5, stock: 100 },
    { id: '2', name: 'Banana', category: 'Fruit', price: 0.3, stock: 150 },
    { id: '3', name: 'Milk', category: 'Dairy', price: 2.5, stock: 50 },
  ],
  searchProducts: (term) =>
    set((state) => ({
      products: state.products.filter(
        (product) =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.category.toLowerCase().includes(term.toLowerCase())
      ),
    })),
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: Date.now().toString() }],
    })),
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      ),
    })),
  updateStock: (id, newStock) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, stock: newStock } : product
      ),
    })),
}));