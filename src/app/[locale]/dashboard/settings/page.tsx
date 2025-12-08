'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export default function SettingsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; email?: string; created_at: string; email_confirmed_at?: string } | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };
    loadUserData();
  }, [supabase.auth]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold">Password</p>
              <p className="text-sm text-muted-foreground">
                Last changed: Never
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Account Created</span>
            <span className="font-semibold">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-sm">{user?.id?.slice(0, 8) || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Email Verified</span>
            <span className="font-semibold">
              {user?.email_confirmed_at ? 'Yes' : 'No'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
