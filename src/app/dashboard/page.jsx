'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { IconUser, IconMail, IconShield, IconCalendar, IconLogout, IconSettings, IconEdit } from '@tabler/icons-react';

export default function Dashboard() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">
                  Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    src={session?.user?.image}
                    name={session?.user?.name}
                    alt={session?.user?.name}
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                >
                  <IconLogout className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening with your account today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconUser className="mr-2 h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and verification status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <IconUser className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Name</span>
                    </div>
                    <p className="text-sm pl-6">{session?.user?.name}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <IconMail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-sm pl-6">{session?.user?.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <IconShield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Verification Status</span>
                    </div>
                    <div className="pl-6">
                      <Badge variant={session?.user?.emailVerified ? "default" : "secondary"}>
                        {session?.user?.emailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <IconCalendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <p className="text-sm pl-6">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex space-x-3">
                  <Button size="sm" className="flex items-center">
                    <IconEdit className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <IconSettings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your account is in good standing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Excellent security practices
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Now</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Currently active
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest account activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <IconUser className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      Account created successfully
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Welcome to the platform! Your account is now active.
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-muted-foreground">
                    Just now
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <IconShield className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      Email verified
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your email address has been successfully verified.
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-muted-foreground">
                    2 min ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
  );
}