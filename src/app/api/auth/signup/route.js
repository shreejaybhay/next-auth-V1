import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { sendVerificationEmail } from '../../../../lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    let { name, email, password } = body;

    // -------- Validation --------
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    name = name.trim();
    email = email.toLowerCase().trim();

    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Strong password policy
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            'Password must be at least 8 characters long and include at least one letter and one number',
        },
        { status: 400 }
      );
    }

    await connectDB();

    // -------- Check existing user --------
    const existingUser = await User.findOne({ email });

    // User exists but email not verified → resend verification
    if (existingUser && !existingUser.emailVerified) {
      const token = existingUser.generateEmailVerificationToken();
      await existingUser.save();

      await sendVerificationEmail(
        existingUser.email,
        token,
        existingUser.name
      );

      return NextResponse.json(
        {
          message:
            'Account already exists but email is not verified. Verification email resent.',
        },
        { status: 200 }
      );
    }

    // User exists and verified
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // -------- Create user --------
    const user = new User({
      name,
      email,
      password,
      provider: 'credentials',
    });

    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // -------- Send verification email --------
    const emailResult = await sendVerificationEmail(
      email,
      verificationToken,
      name
    );

    if (!emailResult.success) {
      console.error('Verification email failed:', emailResult.error);
    }

    return NextResponse.json(
      {
        message:
          'Account created successfully. Please check your email to verify your account.',
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);

    // Handle duplicate email race condition
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
