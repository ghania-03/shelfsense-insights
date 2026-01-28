import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Bell,
  Palette,
  Shield,
  Database,
  Download,
  Save,
  Moon,
  Sun,
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="card-elevated">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Profile</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground">{user?.name}</h4>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-primary capitalize mt-1">{user?.role} Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
          </div>

          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="card-elevated">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Appearance</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Select your preferred color scheme</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Compact Mode</p>
              <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="card-elevated">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'Performance Alerts', desc: 'Get notified when zones underperform' },
            { label: 'Import Completion', desc: 'Notify when data imports finish' },
            { label: 'Weekly Reports', desc: 'Receive weekly performance summaries' },
            { label: 'Product Recommendations', desc: 'Get shelf optimization suggestions' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      {/* Data Management Section */}
      <div className="card-elevated">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Data Management</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Export All Data</p>
              <p className="text-sm text-muted-foreground">Download all your store data as CSV</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Data Retention</p>
              <p className="text-sm text-muted-foreground">How long to keep historical data</p>
            </div>
            <Select defaultValue="12">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="24">24 months</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="card-elevated">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Security</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <Button>Update Password</Button>
        </div>
      </div>
    </div>
  );
}
