'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { IconLoader2, IconMail, IconCheck, IconShield, IconBrandGoogle, IconBrandGithub, IconArrowRight, IconDashboard, IconLogout } from '@tabler/icons-react';

export default function Page() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">
                {process.env.NEXT_PUBLIC_APP_NAME || 'NextAuth Starter'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={session.user?.image}
                      name={session.user?.name}
                      alt={session.user?.name}
                    />
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard">
                      <IconDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                  >
                    <IconLogout className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/auth/signin">
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/signup">
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
            Welcome to{' '}
            <span className="text-primary">
              NextAuth Starter
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-muted-foreground mb-8">
            A complete authentication system with email verification, OAuth providers, and secure user management.
          </p>

          {session ? (
            <div className="flex flex-col items-center space-y-4">
              <Badge variant="default">
                Welcome back, {session.user?.name}!
              </Badge>
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Go to Dashboard
                  <IconArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/signup">
                  Get Started
                  <IconArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <IconMail className="h-6 w-6" />
              </div>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>
                Secure email verification for new accounts with beautiful email templates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <IconCheck className="h-6 w-6" />
              </div>
              <CardTitle>OAuth Providers</CardTitle>
              <CardDescription>
                Sign in with Google and GitHub for seamless authentication
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                <IconShield className="h-6 w-6" />
              </div>
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Password hashing, JWT tokens, and enterprise-grade security
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* OAuth Preview */}
        {!session && (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Try OAuth Sign In</CardTitle>
              <CardDescription>
                Experience seamless authentication with social providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">
                  <IconBrandGoogle className="mr-2 h-4 w-4" />
                  Continue with Google
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">
                  <IconBrandGithub className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}