# WhatsApp Authentication System - Setup Guide

This guide will help you set up the WhatsApp Authentication System with all required environment variables and services.

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A Meta for Developers account
- A WhatsApp Business account

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/aash591/whatsapp-auth-system-nextjs-supabase.git
   cd whatsapp-auth-system-nextjs-supabase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see detailed guide below)
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables Setup

### Step 1: Copy the Example File
```bash
cp env.example .env.local
```

### Step 2: Database Setup (Supabase)

#### 2.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

#### 2.2 Get Supabase Credentials
1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

#### 2.3 Run Database Migrations
```bash
# The migration file is already included in the project
# You can run it manually in Supabase SQL Editor or use the Supabase CLI
```

### Step 3: JWT Configuration

#### 3.1 Generate JWT Secret
```bash
npm run generate-jwt-secret
```
This will generate a secure JWT secret. Copy the output to `JWT_SECRET` in your `.env.local`.

#### 3.2 JWT Settings (Optional)
- `JWT_EXPIRES_IN`: Token expiration time (default: 1h)
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration (default: 7d)

### Step 4: WhatsApp Business API Setup

#### 4.1 Create Meta for Developers Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Sign up/login with your Facebook account
3. Create a new app or use existing one

#### 4.2 Set Up WhatsApp Business API
1. In your Meta app, go to **Products** → **WhatsApp** → **API Setup**
2. Follow the setup wizard
3. Get your credentials:

**App Secret:**
1. Go to **App Settings** → **Basic**
2. Copy **App Secret** → `WHATSAPP_APP_SECRET`

**Access Token:**
1. Go to **WhatsApp** → **API Setup**
2. Copy **Temporary access token** → `WHATSAPP_ACCESS_TOKEN`
3. **Note**: This is temporary. For production, you'll need a permanent token.

**Phone Number ID:**
1. In **WhatsApp** → **API Setup**
2. Copy **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`

**Verify Token:**
1. Create a random string (e.g., `my-secure-verify-token-123`)
2. Use this for `WHATSAPP_VERIFY_TOKEN`

#### 4.3 Configure Webhook
1. In **WhatsApp** → **Configuration** → **Webhooks**
2. Set **Callback URL**: `https://your-domain.com/api/webhooks/whatsapp`
3. Set **Verify Token**: Use the same value as `WHATSAPP_VERIFY_TOKEN`
4. Subscribe to **messages** events

### Step 5: Security Configuration (Optional)

#### 5.1 CSRF Secret
Generate a random string for additional CSRF protection:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 5.2 Rate Limiting
- `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds (default: 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)

## 🔒 Security Best Practices

### Environment Variables Security
- **Never commit** `.env.local` to version control
- Use different secrets for development and production
- Rotate secrets regularly in production
- Use environment-specific configurations

### Production Deployment
1. **Use HTTPS** for all endpoints
2. **Set up Redis** for persistent rate limiting and CSRF storage
3. **Configure monitoring** (Sentry, etc.)
4. **Use strong secrets** (minimum 64 characters)
5. **Enable HSTS** and other security headers

## 🧪 Testing the Setup

### 1. Test Database Connection
```bash
npm run dev
# Check if the app starts without database errors
```

### 2. Test WhatsApp Integration
1. Go to the signup page
2. Enter your phone number
3. Check if you receive a WhatsApp message
4. Complete the verification process

### 3. Test Authentication Flow
1. Complete signup → verification → password setup
2. Try logging in with your credentials
3. Test protected routes

## 🚨 Troubleshooting

### Common Issues

#### "Database connection failed"
- Check your Supabase credentials
- Ensure the database is running
- Verify the migration has been applied

#### "WhatsApp webhook verification failed"
- Check your `WHATSAPP_VERIFY_TOKEN`
- Ensure the webhook URL is accessible
- Verify the webhook is properly configured in Meta

#### "JWT verification failed"
- Check your `JWT_SECRET` is set correctly
- Ensure the secret is at least 64 characters
- Verify the token hasn't expired

#### "CSRF protection failed"
- Check if cookies are enabled
- Ensure you're using HTTPS in production
- Verify the CSRF token is being sent correctly

### Debug Mode
Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the application logs
3. Verify all environment variables are set correctly
4. Ensure all services (Supabase, WhatsApp) are properly configured

## 🔄 Updates

To update the application:
```bash
git pull origin main
npm install
npm run build
```

---

**Security Note**: This application implements enterprise-grade security features. Make sure to review and customize the security settings according to your specific requirements.
