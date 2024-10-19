import { create } from 'zustand';
import { Product } from './productStore';

export interface SaleItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  date: Date;
  total: number;
  items: SaleItem[];
}

interface SalesStore {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  getSalesByDateRange: (startDate: Date, endDate: Date) => Sale[];
  getDailySales: (date: Date) => Sale[];
  getWeeklySales: (date: Date) => Sale[];
  getMonthlySales: (date: Date) => Sale[];
  getProductFrequency: (startDate: Date, endDate: Date) => { [productId: string]: number };
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  sales: [],
  addSale: (sale) =>
    set((state) => ({
      sales: [...state.sales, { ...sale, id: Date.now().toString() }],
    })),
  getSalesByDateRange: (startDate, endDate) => {
    const { sales } = get();
    return sales.filter((sale) => sale.date >= startDate && sale.date <= endDate);
  },
  getDailySales: (date) => {
    const { sales } = get();
    return sales.filter((sale) => 
      sale.date.toDateString() === date.toDateString()
    );
  },
  getWeeklySales: (date) => {
    const { sales } = get();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return sales.filter((sale) => 
      sale.date >= startOfWeek && sale.date <= endOfWeek
    );
  },
  getMonthlySales: (date) => {
    const { sales } = get();
    return sales.filter((sale) => 
      sale.date.getMonth() === date.getMonth() &&
      sale.date.getFullYear() === date.getFullYear()
    );
  },
  getProductFrequency: (startDate, endDate) => {
    const salesInRange = get().getSalesByDateRange(startDate, endDate);
    const frequency: { [productId: string]: number } = {};
    salesInRange.forEach((sale) => {
      sale.items.forEach((item) => {
        frequency[item.product.id] = (frequency[item.product.id] || 0) + item.quantity;
      });
    });
    return frequency;
  },
}));