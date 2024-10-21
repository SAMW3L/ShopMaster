import { create } from 'zustand';

// Product Interface
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

// Product Store Interface
interface ProductStore {
  products: Product[];
  allProducts: Product[];  // Store all original products here
  searchProducts: (term: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateStock: (id: string, newStock: number) => void;
}

// Product Store
export const useProductStore = create<ProductStore>((set) => ({
  products: [
    { id: '1', name: 'Apple', category: 'Fruit', price: 1000, stock: 100 },
    { id: '2', name: 'Banana', category: 'Fruit', price: 500, stock: 150 },
    { id: '3', name: 'Milk', category: 'Dairy', price: 1500, stock: 50 },
  ],
  
  // Copy the initial products to allProducts so we can reset the list later
  allProducts: [
    { id: '1', name: 'Apple', category: 'Fruit', price: 1000, stock: 100 },
    { id: '2', name: 'Banana', category: 'Fruit', price: 500, stock: 150 },
    { id: '3', name: 'Milk', category: 'Dairy', price: 1500, stock: 50 },
  ],

  // Search products by name or category
  searchProducts: (term) =>
    set((state) => ({
      products:
        term.trim() === ''
          ? state.allProducts // If search term is empty, return all products
          : state.allProducts.filter(
              (product) =>
                product.name.toLowerCase().includes(term.toLowerCase()) ||
                product.category.toLowerCase().includes(term.toLowerCase())
            ),
    })),

  // Add a new product
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: Date.now().toString() }],
      allProducts: [...state.allProducts, { ...product, id: Date.now().toString() }],
    })),

  // Update product details
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      ),
      allProducts: state.allProducts.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      ),
    })),

  // Update product stock
  updateStock: (id, newStock) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, stock: newStock } : product
      ),
      allProducts: state.allProducts.map((product) =>
        product.id === id ? { ...product, stock: newStock } : product
      ),
    })),
}));
