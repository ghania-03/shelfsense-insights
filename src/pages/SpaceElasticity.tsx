import React from 'react';
import { categories } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Maximize2,
  Download,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

const CHART_COLORS = {
  current: 'hsl(168, 70%, 26%)',
  recommended: 'hsl(189, 94%, 43%)',
  efficiency: 'hsl(142, 76%, 36%)',
};

export default function SpaceElasticity() {
  const totalSpace = categories.reduce((sum, cat) => sum + cat.currentSpace, 0);
  
  const spaceData = categories.map(cat => ({
    name: cat.name,
    current: cat.currentSpace,
    recommended: cat.recommendedSpace,
    variance: cat.recommendedSpace - cat.currentSpace,
    variancePercent: (((cat.recommendedSpace - cat.currentSpace) / cat.currentSpace) * 100).toFixed(1),
    efficiency: cat.efficiency,
    sales: cat.salesPercentage,
  }));

  const overAllocated = spaceData.filter(d => d.variance < 0);
  const underAllocated = spaceData.filter(d => d.variance > 0);

  const totalSavings = overAllocated.reduce((sum, d) => sum + Math.abs(d.variance), 0);
  const avgEfficiency = Math.round(
    categories.reduce((sum, cat) => sum + cat.efficiency, 0) / categories.length
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Space Elasticity</h1>
          <p className="text-muted-foreground mt-1">
            Optimize shelf space allocation based on sales performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recalculate
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Maximize2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Space</p>
              <p className="text-xl font-bold text-foreground">{totalSpace}m</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Across all categories</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Space to Reallocate</p>
              <p className="text-xl font-bold text-foreground">{totalSavings}m</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">From {overAllocated.length} categories</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Need More Space</p>
              <p className="text-xl font-bold text-foreground">{underAllocated.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Categories under-allocated</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Efficiency</p>
              <p className="text-xl font-bold text-foreground">{avgEfficiency}%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Current space utilization</p>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="chart-container">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Current vs Recommended Space Allocation
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spaceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} unit="m" />
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
                formatter={(value: number, name: string) => [`${value}m`, name]}
              />
              <Legend />
              <Bar dataKey="current" name="Current Space" fill={CHART_COLORS.current} radius={[0, 4, 4, 0]} />
              <Bar dataKey="recommended" name="Recommended" fill={CHART_COLORS.recommended} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Efficiency Chart */}
      <div className="chart-container">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Space Efficiency by Category
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spaceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value}%`, 'Efficiency']}
              />
              <Bar dataKey="efficiency" name="Efficiency" radius={[4, 4, 0, 0]}>
                {spaceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.efficiency >= 80
                        ? 'hsl(142, 76%, 36%)'
                        : entry.efficiency >= 50
                        ? 'hsl(38, 92%, 50%)'
                        : 'hsl(0, 84%, 50%)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="card-elevated overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Space Allocation Details</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Current Space</th>
                <th>Sales %</th>
                <th>Recommended</th>
                <th>Variance</th>
                <th>Efficiency</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {spaceData.map(category => (
                <tr key={category.name}>
                  <td className="font-medium">{category.name}</td>
                  <td>{category.current}m</td>
                  <td>{category.sales}%</td>
                  <td>{category.recommended}m</td>
                  <td>
                    <div className="flex items-center gap-2">
                      {category.variance > 0 ? (
                        <ArrowUp className="w-4 h-4 text-success" />
                      ) : category.variance < 0 ? (
                        <ArrowDown className="w-4 h-4 text-destructive" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          'font-medium',
                          category.variance > 0 && 'text-success',
                          category.variance < 0 && 'text-destructive'
                        )}
                      >
                        {category.variance > 0 ? '+' : ''}
                        {category.variance}m ({category.variancePercent}%)
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            category.efficiency >= 80
                              ? 'bg-success'
                              : category.efficiency >= 50
                              ? 'bg-warning'
                              : 'bg-destructive'
                          )}
                          style={{ width: `${category.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm">{category.efficiency}%</span>
                    </div>
                  </td>
                  <td>
                    {category.variance !== 0 && (
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                          category.variance < 0
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-success/10 text-success'
                        )}
                      >
                        {category.variance < 0 ? 'Reduce' : 'Increase'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-elevated p-5">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ArrowDown className="w-5 h-5 text-destructive" />
            Reduce Allocation
          </h4>
          <div className="space-y-3">
            {overAllocated.map(cat => (
              <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
                <span className="font-medium">{cat.name}</span>
                <span className="text-sm text-destructive">
                  {cat.variance}m ({cat.variancePercent}%)
                </span>
              </div>
            ))}
            {overAllocated.length === 0 && (
              <p className="text-sm text-muted-foreground">No categories over-allocated</p>
            )}
          </div>
        </div>

        <div className="card-elevated p-5">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <ArrowUp className="w-5 h-5 text-success" />
            Increase Allocation
          </h4>
          <div className="space-y-3">
            {underAllocated.map(cat => (
              <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-success/5">
                <span className="font-medium">{cat.name}</span>
                <span className="text-sm text-success">
                  +{cat.variance}m (+{cat.variancePercent}%)
                </span>
              </div>
            ))}
            {underAllocated.length === 0 && (
              <p className="text-sm text-muted-foreground">No categories under-allocated</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
