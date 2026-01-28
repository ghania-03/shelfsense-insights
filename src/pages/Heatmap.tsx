import React, { useState } from 'react';
import { heatmapData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Map,
  Download,
  Info,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const getPerformanceColor = (performance: number) => {
  if (performance >= 70) return 'bg-blue-500 hover:bg-blue-400';
  if (performance >= 40) return 'bg-orange-500 hover:bg-orange-400';
  return 'bg-red-500 hover:bg-red-400';
};

const getPerformanceLabel = (performance: number) => {
  if (performance >= 70) return 'High';
  if (performance >= 40) return 'Medium';
  return 'Low';
};

const getTrafficColor = (traffic: string) => {
  switch (traffic) {
    case 'high':
      return 'text-success';
    case 'medium':
      return 'text-warning';
    case 'low':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

export default function Heatmap() {
  const [selectedZone, setSelectedZone] = useState<typeof heatmapData[0] | null>(null);
  const [viewMode, setViewMode] = useState<'performance' | 'traffic'>('performance');

  // Group by rows
  const rows = [
    heatmapData.filter(d => d.y === 0),
    heatmapData.filter(d => d.y === 1),
    heatmapData.filter(d => d.y === 2),
  ];

  const highPerformanceZones = heatmapData.filter(d => d.performance >= 70);
  const lowPerformanceZones = heatmapData.filter(d => d.performance < 40);
  const misalignedZones = heatmapData.filter(
    d => (d.traffic === 'high' && d.performance < 50) || (d.traffic === 'low' && d.performance >= 70)
  );

  const avgPerformance = Math.round(
    heatmapData.reduce((sum, d) => sum + d.performance, 0) / heatmapData.length
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Store Heatmap</h1>
          <p className="text-muted-foreground mt-1">
            Analyze product placement and traffic zone performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'performance' | 'traffic')}>
            <SelectTrigger className="w-[160px]">
              <Eye className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="traffic">Traffic</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Map className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Zones</p>
              <p className="text-xl font-bold text-foreground">{heatmapData.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Store floor sections</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Performers</p>
              <p className="text-xl font-bold text-foreground">{highPerformanceZones.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Zones with 70%+ efficiency</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Performers</p>
              <p className="text-xl font-bold text-foreground">{lowPerformanceZones.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Zones below 40% efficiency</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Misaligned</p>
              <p className="text-xl font-bold text-foreground">{misalignedZones.length}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Traffic/performance mismatch</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Grid */}
        <div className="lg:col-span-2 chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-foreground">Store Floor Plan</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span className="text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500" />
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-muted-foreground">Low</span>
              </div>
            </div>
          </div>

          {/* Floor Plan Labels */}
          <div className="mb-2 flex justify-between px-2">
            <span className="text-xs text-muted-foreground">← Entrance</span>
            <span className="text-xs text-muted-foreground">Back of Store →</span>
          </div>

          {/* Heatmap Grid */}
          <div className="space-y-3">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-3">
                <div className="w-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
                  {['Front', 'Middle', 'Back'][rowIndex]}
                </div>
                <div className="flex-1 grid grid-cols-4 gap-3">
                  {row.map((zone) => (
                    <Tooltip key={zone.zone}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setSelectedZone(zone)}
                          className={cn(
                            'heatmap-cell aspect-square flex flex-col items-center justify-center p-3 text-white transition-all duration-200',
                            getPerformanceColor(zone.performance),
                            selectedZone?.zone === zone.zone && 'ring-2 ring-white ring-offset-2 ring-offset-background'
                          )}
                        >
                          <span className="text-sm font-bold">{zone.zone}</span>
                          <span className="text-xs opacity-90">{zone.performance}%</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-semibold">{zone.zone}: {zone.category}</p>
                          <p className="text-sm">Performance: {zone.performance}%</p>
                          <p className="text-sm">Traffic: {zone.traffic}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Aisle Labels */}
          <div className="mt-4 flex gap-3">
            <div className="w-8" />
            <div className="flex-1 grid grid-cols-4 gap-3">
              {['Aisle 1', 'Aisle 2', 'Aisle 3', 'Aisle 4'].map((aisle) => (
                <div key={aisle} className="text-center text-xs text-muted-foreground">
                  {aisle}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zone Details Panel */}
        <div className="chart-container">
          <h3 className="text-sm font-semibold text-foreground mb-4">Zone Details</h3>
          
          {selectedZone ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{selectedZone.zone}</span>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      selectedZone.performance >= 70
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : selectedZone.performance >= 40
                        ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    )}
                  >
                    {getPerformanceLabel(selectedZone.performance)}
                  </span>
                </div>
                <p className="text-muted-foreground">{selectedZone.category}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Performance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          selectedZone.performance >= 70
                            ? 'bg-blue-500'
                            : selectedZone.performance >= 40
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        )}
                        style={{ width: `${selectedZone.performance}%` }}
                      />
                    </div>
                    <span className="font-medium">{selectedZone.performance}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Traffic Level</span>
                  <span className={cn('font-medium capitalize', getTrafficColor(selectedZone.traffic))}>
                    {selectedZone.traffic}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Position</span>
                  <span className="font-medium">
                    Row {selectedZone.y + 1}, Col {selectedZone.x + 1}
                  </span>
                </div>
              </div>

              {/* Recommendations */}
              {selectedZone.performance < 50 && selectedZone.traffic === 'high' && (
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Optimization Opportunity</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This high-traffic zone has low performance. Consider moving core products here.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Info className="w-10 h-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">Click on a zone to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-foreground">Top Zone</span>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">
            {highPerformanceZones[0]?.zone || 'N/A'}
          </p>
          <p className="text-sm text-muted-foreground">
            {highPerformanceZones[0]?.category} - {highPerformanceZones[0]?.performance}% performance
          </p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-sm font-medium text-foreground">Needs Attention</span>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">
            {lowPerformanceZones[0]?.zone || 'N/A'}
          </p>
          <p className="text-sm text-muted-foreground">
            {lowPerformanceZones[0]?.category} - Only {lowPerformanceZones[0]?.performance}% performance
          </p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm font-medium text-foreground">Store Average</span>
          </div>
          <p className="text-2xl font-bold text-foreground mb-1">{avgPerformance}%</p>
          <p className="text-sm text-muted-foreground">
            Overall zone performance score
          </p>
        </div>
      </div>
    </div>
  );
}
