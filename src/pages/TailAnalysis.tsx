import React, { useState, useMemo } from 'react';
import { products, categories, monthLabels } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowUpDown,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from 'recharts';

type SortField = 'sku' | 'name' | 'category' | 'salesPercentage';
type SortDirection = 'asc' | 'desc';

const CHART_COLORS = {
  core: 'hsl(142, 76%, 36%)',
  tail: 'hsl(0, 84%, 50%)',
  primary: 'hsl(168, 70%, 26%)',
  accent: 'hsl(189, 94%, 43%)',
};

export default function TailAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('salesPercentage');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const coreProducts = products.filter(p => !p.isTail);
  const tailProducts = products.filter(p => p.isTail);

  const corePercentage = Math.round((coreProducts.length / products.length) * 100);
  const tailPercentage = 100 - corePercentage;

  const coreSalesContribution = coreProducts.reduce((sum, p) => sum + p.salesPercentage, 0);
  const tailSalesContribution = tailProducts.reduce((sum, p) => sum + p.salesPercentage, 0);

  const pieData = [
    { name: 'Core', value: coreProducts.length, sales: coreSalesContribution.toFixed(1) },
    { name: 'Tail', value: tailProducts.length, sales: tailSalesContribution.toFixed(1) },
  ];

  const categoryBreakdown = categories.map(cat => {
    const catProducts = products.filter(p => p.category === cat.name);
    const catCore = catProducts.filter(p => !p.isTail).length;
    const catTail = catProducts.filter(p => p.isTail).length;
    return {
      name: cat.name,
      core: catCore,
      tail: catTail,
      total: catProducts.length,
    };
  });

  const trendData = monthLabels.map((month, i) => ({
    month,
    coreShare: Math.round(75 + (i * 0.8) + Math.random() * 3),
    tailShare: Math.round(25 - (i * 0.8) - Math.random() * 3),
  }));

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.sku.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'sku':
          comparison = a.sku.localeCompare(b.sku);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'salesPercentage':
          comparison = a.salesPercentage - b.salesPercentage;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, categoryFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tail Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Identify products taking shelf space without meaningful sales contribution
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Core Products</p>
              <p className="text-xl font-bold text-foreground">{coreProducts.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {corePercentage}% of SKUs → {coreSalesContribution.toFixed(1)}% of sales
          </p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tail Products</p>
              <p className="text-xl font-bold text-foreground">{tailProducts.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {tailPercentage}% of SKUs → {tailSalesContribution.toFixed(1)}% of sales
          </p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pareto Ratio</p>
              <p className="text-xl font-bold text-foreground">20/80</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            ~20% products drive ~80% of sales
          </p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Sales/SKU</p>
              <p className="text-xl font-bold text-foreground">
                {(100 / products.length).toFixed(2)}%
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Expected contribution per SKU</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="chart-container">
          <h3 className="text-sm font-semibold text-foreground mb-4">Core vs Tail Split</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill={CHART_COLORS.core} />
                  <Cell fill={CHART_COLORS.tail} />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value} products (${props.payload.sales}% sales)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.core }} />
              <span className="text-sm text-muted-foreground">Core</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS.tail }} />
              <span className="text-sm text-muted-foreground">Tail</span>
            </div>
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="chart-container lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Category Breakdown</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="core" name="Core" stackId="a" fill={CHART_COLORS.core} />
                <Bar dataKey="tail" name="Tail" stackId="a" fill={CHART_COLORS.tail} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="chart-container">
        <h3 className="text-sm font-semibold text-foreground mb-4">Core/Tail Trend (6 Months)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="coreShare"
                name="Core Share"
                stroke={CHART_COLORS.core}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.core }}
              />
              <Line
                type="monotone"
                dataKey="tailShare"
                name="Tail Share"
                stroke={CHART_COLORS.tail}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS.tail }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="card-elevated overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <h3 className="text-lg font-semibold text-foreground">Product Details</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <button
                    onClick={() => handleSort('sku')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    SKU
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Product Name
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Category
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => handleSort('salesPercentage')}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Sales %
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.sku} className="group">
                  <td className="font-mono text-sm">{product.sku}</td>
                  <td className="font-medium">{product.name}</td>
                  <td className="text-muted-foreground">{product.category}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            product.isTail ? 'bg-destructive' : 'bg-success'
                          )}
                          style={{ width: `${Math.min(product.salesPercentage * 20, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm">{product.salesPercentage.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td>
                    {product.isTail ? (
                      <span className="badge-tail">Tail</span>
                    ) : (
                      <span className="badge-core">Core</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>
    </div>
  );
}
