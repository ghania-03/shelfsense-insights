import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  products as initialProducts, 
  categories as initialCategories,
  salesSummary as initialSalesSummary,
  heatmapData as initialHeatmapData,
  stores,
  dateRangeMultipliers,
  storeMultipliers,
  Product,
  Category,
  SalesSummary,
  HeatmapZone,
} from '@/data/mockData';

interface Filters {
  storeId: string;
  dateRange: string;
}

interface DataContextType {
  products: Product[];
  categories: Category[];
  salesSummary: SalesSummary;
  heatmapData: HeatmapZone[];
  filters: Filters;
  isLoading: boolean;
  setFilters: (filters: Filters) => void;
  applyFilters: () => Promise<void>;
  importProducts: (newProducts: Product[]) => void;
  recalculateSpaceElasticity: () => Promise<Category[]>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [salesSummary, setSalesSummary] = useState<SalesSummary>(initialSalesSummary);
  const [heatmapData, setHeatmapData] = useState<HeatmapZone[]>(initialHeatmapData);
  const [filters, setFilters] = useState<Filters>({ storeId: '1', dateRange: '30d' });
  const [isLoading, setIsLoading] = useState(false);

  const applyFilters = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const storeMultiplier = storeMultipliers[filters.storeId] || 1;
    const dateMultiplier = dateRangeMultipliers[filters.dateRange] || 1;
    const combinedMultiplier = storeMultiplier * dateMultiplier;
    
    // Apply multipliers to sales data
    const adjustedProducts = initialProducts.map(product => ({
      ...product,
      salesPercentage: Math.round(product.salesPercentage * combinedMultiplier * 100) / 100,
      monthlySales: product.monthlySales.map(sale => Math.round(sale * combinedMultiplier)),
    }));
    
    setProducts(adjustedProducts);
    
    // Recalculate summary
    const coreCount = adjustedProducts.filter(p => p.classification === 'core').length;
    const averageCount = adjustedProducts.filter(p => p.classification === 'average').length;
    const tailCount = adjustedProducts.filter(p => p.classification === 'tail').length;
    
    setSalesSummary({
      totalSKUs: adjustedProducts.length,
      coreItemsPercentage: Math.round((coreCount / adjustedProducts.length) * 100),
      averageItemsPercentage: Math.round((averageCount / adjustedProducts.length) * 100),
      tailItemsPercentage: Math.round((tailCount / adjustedProducts.length) * 100),
      totalSalesValue: Math.round(initialSalesSummary.totalSalesValue * combinedMultiplier),
      avgSalesPerSKU: Math.round(initialSalesSummary.avgSalesPerSKU * combinedMultiplier),
    });
    
    // Adjust heatmap data
    const adjustedHeatmap = initialHeatmapData.map(zone => ({
      ...zone,
      performance: Math.min(100, Math.round(zone.performance * combinedMultiplier)),
      trafficScore: Math.min(100, Math.round(zone.trafficScore * storeMultiplier)),
    }));
    
    setHeatmapData(adjustedHeatmap);
    
    setIsLoading(false);
  }, [filters]);

  const importProducts = useCallback((newProducts: Product[]) => {
    setProducts(prev => {
      // Merge or add new products
      const productMap = new Map(prev.map(p => [p.sku, p]));
      newProducts.forEach(p => productMap.set(p.sku, p));
      return Array.from(productMap.values());
    });
  }, []);

  const recalculateSpaceElasticity = useCallback(async (): Promise<Category[]> => {
    setIsLoading(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Recalculate based on current product data
    const categoryStats = new Map<string, { sales: number; count: number }>();
    
    products.forEach(product => {
      const stats = categoryStats.get(product.category) || { sales: 0, count: 0 };
      stats.sales += product.salesPercentage;
      stats.count += 1;
      categoryStats.set(product.category, stats);
    });
    
    const totalSales = Array.from(categoryStats.values()).reduce((sum, s) => sum + s.sales, 0);
    const totalSpace = categories.reduce((sum, c) => sum + c.currentSpace, 0);
    
    const updatedCategories = categories.map(category => {
      const stats = categoryStats.get(category.name);
      const salesPercent = stats ? (stats.sales / totalSales) * 100 : 0;
      const recommendedSpace = Math.round((salesPercent / 100) * totalSpace);
      const efficiency = recommendedSpace > 0 
        ? Math.min(100, Math.round((salesPercent / ((category.currentSpace / totalSpace) * 100)) * 100))
        : 0;
      
      return {
        ...category,
        salesPercentage: Math.round(salesPercent * 10) / 10,
        recommendedSpace,
        efficiency,
        productCount: stats?.count || 0,
      };
    });
    
    setCategories(updatedCategories);
    setIsLoading(false);
    
    return updatedCategories;
  }, [products, categories]);

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        salesSummary,
        heatmapData,
        filters,
        isLoading,
        setFilters,
        applyFilters,
        importProducts,
        recalculateSpaceElasticity,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
