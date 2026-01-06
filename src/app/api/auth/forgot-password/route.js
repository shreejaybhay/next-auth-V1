import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { sendPasswordResetEmail } from '../../../../lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.toLowerCase().trim();

    console.log('Forgot password request for email:', email);

    if (!email) {
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', !!user);
    console.log('User has password:', !!user?.password);

    // Enumeration-safe response
    if (!user || !user.password) {
      console.log('No user found or user has no password (OAuth user)');
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token (RAW)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token before saving
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    console.log('Reset token generated and saved for user:', user.email);

    // Send reset email (RAW token)
    try {
      console.log('Attempting to send password reset email...');
      const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name);
      console.log('Email send result:', emailResult);
      
      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error);
      } else {
        console.log('Password reset email sent successfully');
      }
    } catch (emailError) {
      console.error('Password reset email failed:', emailError);
      // Do NOT expose failure
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent a password reset link.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
