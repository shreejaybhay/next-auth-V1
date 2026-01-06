import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { sendVerificationEmail } from '../../../../lib/email';

/* ----------------------------------
   VERIFY EMAIL (GET)
----------------------------------- */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    console.log('Verification Debug:');
    console.log('Original token:', token);
    console.log('Hashed token:', hashedToken);
    console.log('Current time:', new Date().toISOString());

    await connectDB();

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    console.log('User found:', !!user);
    if (!user) {
      // Let's also check if user exists with this token but expired
      const expiredUser = await User.findOne({
        emailVerificationToken: hashedToken,
      });
      console.log('Expired user found:', !!expiredUser);
      if (expiredUser) {
        console.log('Token expires at:', expiredUser.emailVerificationExpires);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully. You can now log in.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/* ----------------------------------
   RESEND VERIFICATION (POST)
----------------------------------- */
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'If an account exists, a verification email has been sent.' },
        { status: 200 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    const user = await User.findOne({ email: normalizedEmail });

    if (user && !user.emailVerified) {
      const token = user.generateEmailVerificationToken();
      await user.save();

      await sendVerificationEmail(
        user.email,
        token,
        user.name
      );
    }

    // Always return success (prevents email enumeration)
    return NextResponse.json(
      { message: 'If an account exists, a verification email has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
