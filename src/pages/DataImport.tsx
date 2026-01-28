import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Trash2,
  Download,
} from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: 'products' | 'sales' | 'categories';
  status: 'pending' | 'validated' | 'error';
  rows?: number;
  errors?: string[];
}

const sampleFiles = [
  { name: 'products_template.csv', type: 'products', description: 'Product inventory with SKU, name, category, price' },
  { name: 'sales_template.csv', type: 'sales', description: 'Sales transactions by date and product' },
  { name: 'categories_template.csv', type: 'categories', description: 'Category definitions and space allocation' },
];

export default function DataImport() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const csvFiles = droppedFiles.filter(f => f.name.endsWith('.csv'));
    
    const newFiles: UploadedFile[] = csvFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: 'products' as const,
      status: 'pending' as const,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate validation
    setTimeout(() => {
      setFiles(prev =>
        prev.map(f => ({
          ...f,
          status: Math.random() > 0.2 ? 'validated' : 'error',
          rows: Math.floor(Math.random() * 500) + 50,
          errors: Math.random() > 0.2 ? undefined : ['Row 15: Invalid SKU format', 'Row 42: Missing category'],
        }))
      );
    }, 1500);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const csvFiles = selectedFiles.filter(f => f.name.endsWith('.csv'));
      
      const newFiles: UploadedFile[] = csvFiles.map(f => ({
        name: f.name,
        size: f.size,
        type: 'products' as const,
        status: 'pending' as const,
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      
      // Simulate validation
      setTimeout(() => {
        setFiles(prev =>
          prev.map(f => ({
            ...f,
            status: Math.random() > 0.2 ? 'validated' : 'error',
            rows: Math.floor(Math.random() * 500) + 50,
            errors: Math.random() > 0.2 ? undefined : ['Row 15: Invalid SKU format'],
          }))
        );
      }, 1500);
    }
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Data Import</h1>
        <p className="text-muted-foreground mt-1">
          Upload and manage your product, sales, and category data
        </p>
      </div>

      {/* Steps Indicator */}
      <div className="flex items-center justify-center gap-4">
        {['Upload', 'Map Columns', 'Preview & Import'].map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  i === 0 && step === 'upload' && 'bg-primary text-primary-foreground',
                  i === 1 && step === 'mapping' && 'bg-primary text-primary-foreground',
                  i === 2 && step === 'preview' && 'bg-primary text-primary-foreground',
                  ((i === 0 && step !== 'upload') || (i === 1 && step === 'preview')) &&
                    'bg-success text-success-foreground',
                  ((i === 1 && step === 'upload') || (i === 2 && step !== 'preview')) &&
                    'bg-muted text-muted-foreground'
                )}
              >
                {((i === 0 && step !== 'upload') || (i === 1 && step === 'preview')) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium hidden sm:block',
                  ((i === 0 && step === 'upload') ||
                    (i === 1 && step === 'mapping') ||
                    (i === 2 && step === 'preview'))
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className="w-12 h-0.5 bg-border" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        <Input
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Drop your CSV files here
          </h3>
          <p className="text-muted-foreground mb-4">
            or click to browse from your computer
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: Products, Sales, Categories CSV files
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="card-elevated">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Uploaded Files</h3>
          </div>
          <div className="divide-y divide-border">
            {files.map((file) => (
              <div key={file.name} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                    {file.rows && ` • ${file.rows} rows`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {file.status === 'pending' && (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  {file.status === 'validated' && (
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Valid</span>
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Errors</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFile(file.name)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {files.some(f => f.status === 'validated') && (
            <div className="p-4 border-t border-border flex justify-end">
              <Button onClick={() => setStep('mapping')}>
                Continue to Mapping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Sample Templates */}
      <div className="card-elevated">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Sample Templates</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Download these templates to format your data correctly
          </p>
        </div>
        <div className="divide-y divide-border">
          {sampleFiles.map((file) => (
            <div key={file.name} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{file.description}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="card-elevated p-5 bg-primary/5 border-primary/20">
        <h4 className="font-semibold text-foreground mb-2">Import Guidelines</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>CSV files must have headers in the first row</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>SKU codes must be unique across all products</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>Date formats should be YYYY-MM-DD</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>Maximum file size: 10MB per file</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
