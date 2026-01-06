'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  IconLoader2,
  IconCheck,
  IconX,
  IconMail,
} from '@tabler/icons-react';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing or invalid.');
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Your email has been verified.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification link is invalid or expired.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {status === 'verifying' && (
              <IconLoader2 className="h-6 w-6 animate-spin" />
            )}
            {status === 'success' && <IconCheck className="h-6 w-6" />}
            {status === 'error' && <IconX className="h-6 w-6" />}
          </div>

          <CardTitle className="text-2xl font-bold">
            {status === 'verifying' && 'Verifying Email'}
            {status === 'success' && 'Email Verified'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>

          <CardDescription>
            {status === 'verifying' &&
              'Please wait while we verify your email address.'}
            {status === 'success' &&
              'Your email has been successfully verified.'}
            {status === 'error' &&
              'There was a problem verifying your email.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'success' && (
            <Alert>
              <IconCheck className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <IconX className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'verifying' && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <IconMail className="h-4 w-4" />
              <span>Checking your verification token…</span>
            </div>
          )}

          {status === 'success' && (
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signup">Sign Up Again</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/signin">Back to Sign In</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
