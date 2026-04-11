import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { Shield, Settings2, Bell, LayoutDashboard, Save } from 'lucide-react';

interface SettingsDraft {
  emailNotifications: string;
  mobileNotifications: string;
  reminderWindow: string;
  defaultLandingPage: string;
}

const STORAGE_KEY = 'codify_account_settings';

const loadSettings = (userId: string): SettingsDraft => {
  const fallback: SettingsDraft = {
    emailNotifications: 'Enabled',
    mobileNotifications: 'Enabled',
    reminderWindow: '30 minutes',
    defaultLandingPage: 'dashboard',
  };

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, SettingsDraft>) : {};
    return parsed[userId] || fallback;
  } catch {
    return fallback;
  }
};

const saveSettings = (userId: string, settings: SettingsDraft) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, SettingsDraft>) : {};
    parsed[userId] = settings;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Ignore storage failures for this mock settings page.
  }
};

export function AccountSettings() {
  const { currentUser } = useAuth();
  const [settings, setSettings] = React.useState<SettingsDraft>({
    emailNotifications: 'Enabled',
    mobileNotifications: 'Enabled',
    reminderWindow: '30 minutes',
    defaultLandingPage: 'dashboard',
  });

  React.useEffect(() => {
    if (!currentUser) {
      return;
    }

    setSettings(loadSettings(currentUser.id));
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  const handleSave = () => {
    saveSettings(currentUser.id, settings);
    toast.success('Settings saved');
  };

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white via-white to-neutral-50/60 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Settings2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Settings</h2>
              <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed max-w-lg">
                Preferences stay in sync across devices. Changes apply to this account only.
              </p>
            </div>
          </div>
          {isAdmin && (
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-md shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Shield className="h-4 w-4 shrink-0 opacity-95" />
              <span>Administrator</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-neutral-200/90 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-neutral-100 bg-neutral-50/50 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-neutral-600" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>Choose how we reach you about courses and reminders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="emailNotifications" className="text-neutral-700">Email</Label>
              <Select
                value={settings.emailNotifications}
                onValueChange={(v) => setSettings((prev) => ({ ...prev, emailNotifications: v }))}
              >
                <SelectTrigger id="emailNotifications" className="h-11 bg-white border-neutral-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enabled">Enabled</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNotifications" className="text-neutral-700">Mobile</Label>
              <Select
                value={settings.mobileNotifications}
                onValueChange={(v) => setSettings((prev) => ({ ...prev, mobileNotifications: v }))}
              >
                <SelectTrigger id="mobileNotifications" className="h-11 bg-white border-neutral-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enabled">Enabled</SelectItem>
                  <SelectItem value="Disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200/90 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-neutral-100 bg-neutral-50/50 pb-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-neutral-600" />
              <CardTitle className="text-lg">Workspace</CardTitle>
            </div>
            <CardDescription>Defaults when you sign in and how early we remind you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="reminderWindow" className="text-neutral-700">Reminder window</Label>
              <Select
                value={settings.reminderWindow}
                onValueChange={(v) => setSettings((prev) => ({ ...prev, reminderWindow: v }))}
              >
                <SelectTrigger id="reminderWindow" className="h-11 bg-white border-neutral-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 minutes">15 minutes</SelectItem>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="1 day">1 day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLandingPage" className="text-neutral-700">Default landing page</Label>
              <Select
                value={settings.defaultLandingPage}
                onValueChange={(v) => setSettings((prev) => ({ ...prev, defaultLandingPage: v }))}
              >
                <SelectTrigger id="defaultLandingPage" className="h-11 bg-white border-neutral-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="courses">Courses</SelectItem>
                  <SelectItem value="leaderboard">Leaderboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <Button
          onClick={handleSave}
          className="h-11 px-6 text-white shadow-md hover:opacity-90 sm:min-w-[160px]"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Save className="h-4 w-4 mr-2" />
          Save settings
        </Button>
      </div>
    </div>
  );
}
