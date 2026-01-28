// Mock data for ShelfIQ Dashboard

export interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  shelfSpace: number; // in meters
  salesPercentage: number;
  isTail: boolean;
  monthlySales: number[];
}

export interface Category {
  id: string;
  name: string;
  currentSpace: number; // in meters
  salesPercentage: number;
  recommendedSpace: number;
  productCount: number;
  efficiency: number; // 0-100
}

export interface Store {
  id: string;
  name: string;
  location: string;
}

export interface SalesSummary {
  totalSKUs: number;
  coreItemsPercentage: number;
  tailItemsPercentage: number;
  totalSalesValue: number;
  avgSalesPerSKU: number;
}

export const stores: Store[] = [
  { id: '1', name: 'Downtown Central', location: 'New York, NY' },
  { id: '2', name: 'Westside Market', location: 'Los Angeles, CA' },
  { id: '3', name: 'Harbor View', location: 'San Francisco, CA' },
];

export const categories: Category[] = [
  { id: '1', name: 'Groceries', currentSpace: 45, salesPercentage: 38, recommendedSpace: 42, productCount: 156, efficiency: 84 },
  { id: '2', name: 'Household', currentSpace: 25, salesPercentage: 22, recommendedSpace: 24, productCount: 89, efficiency: 88 },
  { id: '3', name: 'Personal Care', currentSpace: 18, salesPercentage: 18, recommendedSpace: 20, productCount: 67, efficiency: 100 },
  { id: '4', name: 'Beverages', currentSpace: 20, salesPercentage: 15, recommendedSpace: 17, productCount: 45, efficiency: 75 },
  { id: '5', name: 'Snacks', currentSpace: 12, salesPercentage: 5, recommendedSpace: 6, productCount: 38, efficiency: 42 },
  { id: '6', name: 'Frozen Foods', currentSpace: 10, salesPercentage: 2, recommendedSpace: 3, productCount: 25, efficiency: 20 },
];

export const products: Product[] = [
  // Core Products (high sales)
  { sku: 'GRO-001', name: 'Organic Whole Milk', category: 'Groceries', price: 5.99, shelfSpace: 0.8, salesPercentage: 4.2, isTail: false, monthlySales: [1200, 1350, 1180, 1420, 1380, 1290] },
  { sku: 'GRO-002', name: 'Whole Wheat Bread', category: 'Groceries', price: 3.49, shelfSpace: 0.6, salesPercentage: 3.8, isTail: false, monthlySales: [980, 1020, 1100, 1050, 1150, 1080] },
  { sku: 'GRO-003', name: 'Free Range Eggs (12pk)', category: 'Groceries', price: 4.99, shelfSpace: 0.5, salesPercentage: 3.5, isTail: false, monthlySales: [850, 920, 880, 950, 910, 940] },
  { sku: 'BEV-001', name: 'Premium Orange Juice', category: 'Beverages', price: 6.49, shelfSpace: 0.7, salesPercentage: 3.2, isTail: false, monthlySales: [720, 680, 750, 800, 760, 790] },
  { sku: 'HOU-001', name: 'Multi-Surface Cleaner', category: 'Household', price: 4.29, shelfSpace: 0.4, salesPercentage: 2.8, isTail: false, monthlySales: [620, 580, 650, 610, 640, 670] },
  { sku: 'PER-001', name: 'Natural Shampoo', category: 'Personal Care', price: 8.99, shelfSpace: 0.3, salesPercentage: 2.6, isTail: false, monthlySales: [450, 480, 520, 490, 510, 530] },
  { sku: 'GRO-004', name: 'Greek Yogurt', category: 'Groceries', price: 1.29, shelfSpace: 0.4, salesPercentage: 2.4, isTail: false, monthlySales: [1800, 1920, 1750, 1880, 1950, 1820] },
  { sku: 'SNK-001', name: 'Tortilla Chips', category: 'Snacks', price: 3.99, shelfSpace: 0.5, salesPercentage: 2.2, isTail: false, monthlySales: [380, 420, 450, 410, 390, 430] },
  { sku: 'BEV-002', name: 'Sparkling Water (6pk)', category: 'Beverages', price: 5.99, shelfSpace: 0.8, salesPercentage: 2.0, isTail: false, monthlySales: [520, 560, 580, 540, 600, 570] },
  { sku: 'HOU-002', name: 'Dish Soap', category: 'Household', price: 3.49, shelfSpace: 0.3, salesPercentage: 1.9, isTail: false, monthlySales: [480, 510, 490, 530, 500, 520] },
  
  // More Core Products
  { sku: 'GRO-005', name: 'Butter Unsalted', category: 'Groceries', price: 4.99, shelfSpace: 0.3, salesPercentage: 1.8, isTail: false, monthlySales: [340, 360, 380, 350, 370, 390] },
  { sku: 'PER-002', name: 'Body Lotion', category: 'Personal Care', price: 7.49, shelfSpace: 0.25, salesPercentage: 1.7, isTail: false, monthlySales: [280, 310, 290, 320, 300, 330] },
  { sku: 'GRO-006', name: 'Cheddar Cheese', category: 'Groceries', price: 5.49, shelfSpace: 0.35, salesPercentage: 1.6, isTail: false, monthlySales: [420, 440, 410, 450, 430, 460] },
  { sku: 'HOU-003', name: 'Paper Towels (6 roll)', category: 'Household', price: 8.99, shelfSpace: 1.2, salesPercentage: 1.5, isTail: false, monthlySales: [220, 250, 230, 260, 240, 270] },
  { sku: 'BEV-003', name: 'Almond Milk', category: 'Beverages', price: 4.49, shelfSpace: 0.5, salesPercentage: 1.4, isTail: false, monthlySales: [380, 410, 390, 420, 400, 430] },
  
  // Tail Products (low sales, occupy space)
  { sku: 'FRZ-001', name: 'Organic Peas (frozen)', category: 'Frozen Foods', price: 3.99, shelfSpace: 0.4, salesPercentage: 0.3, isTail: true, monthlySales: [45, 38, 52, 41, 35, 48] },
  { sku: 'FRZ-002', name: 'Veggie Burgers', category: 'Frozen Foods', price: 6.99, shelfSpace: 0.5, salesPercentage: 0.25, isTail: true, monthlySales: [32, 28, 35, 30, 25, 33] },
  { sku: 'SNK-002', name: 'Rice Cakes Plain', category: 'Snacks', price: 2.99, shelfSpace: 0.35, salesPercentage: 0.2, isTail: true, monthlySales: [22, 18, 25, 20, 15, 23] },
  { sku: 'SNK-003', name: 'Seaweed Snacks', category: 'Snacks', price: 4.49, shelfSpace: 0.2, salesPercentage: 0.18, isTail: true, monthlySales: [15, 12, 18, 14, 10, 16] },
  { sku: 'GRO-007', name: 'Artisanal Olive Oil', category: 'Groceries', price: 18.99, shelfSpace: 0.3, salesPercentage: 0.15, isTail: true, monthlySales: [8, 12, 10, 6, 9, 11] },
  { sku: 'PER-003', name: 'Organic Face Cream', category: 'Personal Care', price: 24.99, shelfSpace: 0.15, salesPercentage: 0.12, isTail: true, monthlySales: [5, 8, 6, 4, 7, 9] },
  { sku: 'HOU-004', name: 'Eco Laundry Pods', category: 'Household', price: 15.99, shelfSpace: 0.4, salesPercentage: 0.1, isTail: true, monthlySales: [12, 15, 10, 8, 14, 11] },
  { sku: 'FRZ-003', name: 'Acai Bowls', category: 'Frozen Foods', price: 8.99, shelfSpace: 0.35, salesPercentage: 0.08, isTail: true, monthlySales: [6, 4, 8, 5, 3, 7] },
  { sku: 'BEV-004', name: 'Coconut Water Premium', category: 'Beverages', price: 3.99, shelfSpace: 0.25, salesPercentage: 0.06, isTail: true, monthlySales: [18, 22, 15, 20, 12, 19] },
  { sku: 'SNK-004', name: 'Kale Chips', category: 'Snacks', price: 5.99, shelfSpace: 0.25, salesPercentage: 0.05, isTail: true, monthlySales: [8, 5, 10, 6, 4, 9] },
  { sku: 'GRO-008', name: 'Truffle Salt', category: 'Groceries', price: 12.99, shelfSpace: 0.1, salesPercentage: 0.04, isTail: true, monthlySales: [3, 5, 2, 4, 6, 3] },
  { sku: 'FRZ-004', name: 'Cauliflower Rice', category: 'Frozen Foods', price: 4.49, shelfSpace: 0.3, salesPercentage: 0.03, isTail: true, monthlySales: [4, 6, 3, 5, 2, 4] },
  { sku: 'PER-004', name: 'Bamboo Toothbrush Set', category: 'Personal Care', price: 9.99, shelfSpace: 0.1, salesPercentage: 0.02, isTail: true, monthlySales: [2, 4, 3, 1, 5, 2] },
  { sku: 'HOU-005', name: 'Beeswax Wraps', category: 'Household', price: 14.99, shelfSpace: 0.15, salesPercentage: 0.015, isTail: true, monthlySales: [1, 3, 2, 0, 4, 1] },
];

export const salesSummary: SalesSummary = {
  totalSKUs: products.length,
  coreItemsPercentage: Math.round((products.filter(p => !p.isTail).length / products.length) * 100),
  tailItemsPercentage: Math.round((products.filter(p => p.isTail).length / products.length) * 100),
  totalSalesValue: 1284500,
  avgSalesPerSKU: 42816,
};

export const heatmapData = [
  // Row 1 (Front of store - high traffic)
  { zone: 'A1', category: 'Groceries', traffic: 'high', performance: 92, x: 0, y: 0 },
  { zone: 'A2', category: 'Beverages', traffic: 'high', performance: 88, x: 1, y: 0 },
  { zone: 'A3', category: 'Snacks', traffic: 'high', performance: 45, x: 2, y: 0 },
  { zone: 'A4', category: 'Personal Care', traffic: 'medium', performance: 78, x: 3, y: 0 },
  
  // Row 2 (Middle aisles)
  { zone: 'B1', category: 'Groceries', traffic: 'medium', performance: 85, x: 0, y: 1 },
  { zone: 'B2', category: 'Household', traffic: 'medium', performance: 72, x: 1, y: 1 },
  { zone: 'B3', category: 'Frozen Foods', traffic: 'low', performance: 25, x: 2, y: 1 },
  { zone: 'B4', category: 'Household', traffic: 'medium', performance: 68, x: 3, y: 1 },
  
  // Row 3 (Back of store - low traffic)
  { zone: 'C1', category: 'Frozen Foods', traffic: 'low', performance: 18, x: 0, y: 2 },
  { zone: 'C2', category: 'Beverages', traffic: 'low', performance: 35, x: 1, y: 2 },
  { zone: 'C3', category: 'Snacks', traffic: 'low', performance: 22, x: 2, y: 2 },
  { zone: 'C4', category: 'Personal Care', traffic: 'low', performance: 42, x: 3, y: 2 },
];

export const monthLabels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

export const categoryPerformanceTrend = categories.map(cat => ({
  name: cat.name,
  data: monthLabels.map((_, i) => ({
    month: monthLabels[i],
    value: Math.round(cat.salesPercentage * (0.9 + Math.random() * 0.2) * 10) / 10,
  })),
}));
