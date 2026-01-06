# NextAuth Starter - Complete Authentication System

A production-ready Next.js authentication starter with email verification, OAuth providers (Google & GitHub), secure user management, and password reset functionality.

## 🚀 Features

- **Email & Password Authentication** with email verification
- **OAuth Providers**: Google and GitHub sign-in with secure account linking
- **Email Verification**: Required for email/password users (OAuth users are pre-verified)
- **Password Reset**: Complete forgot password flow with email reset links
- **Avatar System**: Shows profile images for OAuth users, initials for credentials users
- **Secure Password Hashing** using bcryptjs
- **JWT Session Management** with NextAuth.js (optimized for performance)
- **MongoDB Integration** with Mongoose
- **Responsive UI** with Tailwind CSS and shadcn/ui components
- **Protected Routes** with middleware (no client-side loading states)
- **Email Service** with Nodemailer and professional HTML templates
- **Security Features**: Account takeover prevention, secure token handling
- **Error Handling** and comprehensive user feedback
- **Performance Optimized**: Minimal database calls, JWT-based sessions

## 📋 Prerequisites

- Node.js 18+
- MongoDB database (local or cloud)
- Gmail account for email service (or other SMTP provider)
- Google OAuth credentials
- GitHub OAuth credentials

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd next-auth-starter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the `.env` file and update with your credentials:

   ```env
   # Database
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/database

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # App Configuration
   NEXT_PUBLIC_APP_NAME=YourAppName
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # OAuth Providers
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret

   # Email Configuration
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration Guide

### MongoDB Setup

1. Create a MongoDB database (MongoDB Atlas recommended)
2. Get your connection string
3. Update `MONGODB_URL` in your `.env` file

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Update `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### Email Service Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update email configuration in `.env`

## 📁 Project Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.js    # NextAuth API route
│   │   ├── signup/route.js           # User registration
│   │   ├── verify-email/route.js     # Email verification
│   │   ├── forgot-password/route.js  # Password reset request
│   │   └── reset-password/route.js   # Password reset handler
│   ├── auth/
│   │   ├── signin/page.jsx           # Sign in page
│   │   ├── signup/page.jsx           # Sign up page
│   │   ├── verify-email/page.jsx     # Email verification page
│   │   ├── forgot-password/page.jsx  # Forgot password page
│   │   ├── reset-password/page.jsx   # Reset password page
│   │   └── error/page.jsx            # Auth error page
│   ├── dashboard/page.jsx            # Protected dashboard
│   ├── layout.js                     # Root layout
│   └── page.js                       # Home page
├── components/
│   ├── auth/
│   │   ├── SignInForm.jsx            # Sign in form
│   │   ├── SignUpForm.jsx            # Sign up form
│   │   └── ProtectedRoute.jsx        # Route protection component
│   ├── ui/
│   │   ├── avatar.jsx                # Avatar component with initials fallback
│   │   ├── button.jsx                # Button component
│   │   ├── input.jsx                 # Input component
│   │   ├── label.jsx                 # Label component (fixed spacing)
│   │   └── ...                       # Other shadcn/ui components
│   └── providers/
│       └── SessionProvider.jsx       # Session context
├── lib/
│   ├── auth.js                       # NextAuth configuration (optimized)
│   ├── mongodb.js                    # Database connection
│   └── email.js                      # Email service with templates
├── models/
│   └── User.js                       # User model with password reset fields
└── middleware.js                     # Route protection middleware
```

## 🔐 Authentication Flow

### Email/Password Registration

1. User fills registration form
2. Server validates input and creates user
3. Verification email sent to user
4. User clicks verification link
5. Email verified, user can now sign in

### OAuth Registration

1. User clicks OAuth provider button
2. Redirected to provider (Google/GitHub)
3. User authorizes application
4. Account created automatically (pre-verified)
5. User redirected to dashboard

### Sign In Process

1. User enters credentials or uses OAuth
2. Server validates credentials
3. For email users: checks if email is verified
4. JWT session created
5. User redirected to dashboard

### Password Reset Flow

1. User clicks "Forgot password?" on sign in page
2. User enters email address
3. Reset email sent with secure token (1-hour expiry)
4. User clicks reset link in email
5. User enters new password
6. Password updated and user can sign in

### Avatar System

- **OAuth Users**: Shows actual profile picture from provider
- **Credentials Users**: Shows initials (first letters of name) in circular badge
- **Consistent Design**: All avatars have same size and styling

## 🛡️ Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure session management with minimal DB calls
- **Email Verification**: Prevents fake accounts
- **Account Takeover Prevention**: OAuth only links to verified email accounts
- **Secure Password Reset**: Time-limited tokens with proper cleanup
- **CSRF Protection**: Built into NextAuth.js
- **Secure Cookies**: HTTP-only, secure flags
- **Input Validation**: Server-side validation
- **Performance Optimized**: Single DB call per sign-in, cached user data in JWT
- **Rate Limiting**: Can be added with middleware

## 🎨 Customization

### Styling

- Built with Tailwind CSS and shadcn/ui components
- Fully responsive design with consistent spacing
- Easy to customize colors and layout
- Dark mode support ready
- Professional form styling with proper label spacing

### Avatar Component

- Reusable Avatar component with fallback to initials
- Multiple sizes: `sm`, `default`, `lg`, `xl`
- Automatic initials generation from user names
- Consistent with design system

### Email Templates

- HTML email templates in `src/lib/email.js`
- Professional verification email template
- Password reset email template
- Customizable branding and styling
- Support for multiple email types

### Database Schema

- Flexible user model in `src/models/User.js`
- Password reset token fields
- Easy to extend with additional fields
- Supports multiple auth providers per user

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms

- Update `NEXTAUTH_URL` to your domain
- Ensure all environment variables are set
- Update OAuth redirect URIs

## 📝 API Routes

- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify-email?token=` - Email verification
- `POST /api/auth/verify-email` - Resend verification
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/reset-password?token=` - Verify reset token
- `POST /api/auth/reset-password` - Reset password
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

## 🧪 Testing

### Manual Testing Checklist

- [ ] Email/password registration
- [ ] Email verification
- [ ] Email/password sign in
- [ ] Google OAuth sign in
- [ ] GitHub OAuth sign in
- [ ] Password reset flow
- [ ] Avatar display (OAuth vs credentials)
- [ ] Account linking security
- [ ] Protected route access
- [ ] Sign out functionality
- [ ] Error handling
- [ ] Form validation
- [ ] Email delivery

### Test Accounts

Create test accounts with different scenarios:

- Verified email user
- Unverified email user
- Google OAuth user
- GitHub OAuth user
- User with password reset

### Security Testing

- [ ] Test account takeover prevention
- [ ] Verify password reset token expiry
- [ ] Test OAuth account linking with unverified emails
- [ ] Verify JWT token security
- [ ] Test form input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database connection is working
4. Check OAuth provider configurations
5. Review email service settings
6. Test password reset email delivery
7. Verify JWT token configuration

## 🔄 Updates

This starter is regularly updated with:

- Security patches and improvements
- New authentication features
- Performance optimizations
- UI/UX enhancements
- Bug fixes

Keep your dependencies updated and follow security best practices.

## 🎯 Recent Updates

- ✅ **Password Reset Flow**: Complete forgot password functionality
- ✅ **Avatar System**: Profile images with initials fallback
- ✅ **Security Improvements**: Account takeover prevention
- ✅ **Performance Optimization**: Reduced database calls
- ✅ **UI Improvements**: Consistent form spacing and styling
- ✅ **Enhanced Email Templates**: Professional HTML emails

---

**Happy coding! 🎉**

Built with ❤️ using Next.js, NextAuth.js, MongoDB, and Tailwind CSS.
