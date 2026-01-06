import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import connectDB from './mongodb';
import User from '../models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in');
        }

        const isPasswordValid = await user.comparePassword(credentials.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'github') {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser) {
          // Only auto-link if the existing user is already verified
          // This prevents account takeover via unverified email accounts
          if (!existingUser.emailVerified) {
            throw new Error('An account with this email exists but is not verified. Please verify your email first or use a different sign-in method.');
          }

          // Safe to link: existing user is verified
          if (account.provider === 'google') {
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId;
            }
            existingUser.image = user.image; // Update image from OAuth provider
            await existingUser.save();
          }

          if (account.provider === 'github') {
            if (!existingUser.githubId) {
              existingUser.githubId = account.providerAccountId;
            }
            existingUser.image = user.image; // Update image from OAuth provider
            await existingUser.save();
          }
        } else {
          // Create new user for OAuth (OAuth users are pre-verified)
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            emailVerified: true, // OAuth users are pre-verified
            provider: account.provider,
            googleId: account.provider === 'google' ? account.providerAccountId : undefined,
            githubId: account.provider === 'github' ? account.providerAccountId : undefined,
          });
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in - store user data in token
      if (user) {
        token.id = user.id;
        token.emailVerified = user.emailVerified;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }

      // For OAuth users, fetch fresh data from DB once and store in token
      if (account && (account.provider === 'google' || account.provider === 'github')) {
        await connectDB();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.emailVerified = dbUser.emailVerified;
          token.name = dbUser.name;
          token.email = dbUser.email;
          // For OAuth users, prioritize the fresh image from the provider
          token.image = user.image || dbUser.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Use token data directly - no DB calls needed
      if (token) {
        session.user.id = token.id;
        session.user.emailVerified = token.emailVerified;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);