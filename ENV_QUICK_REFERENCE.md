# Environment Variables Quick Reference

## 🔴 Required Variables (Must Set)

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `JWT_SECRET` | JWT signing secret (64+ chars) | Generate with `npm run generate-jwt-secret` |
| `WHATSAPP_APP_SECRET` | WhatsApp app secret | Meta for Developers → App Settings → Basic |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verification token | Create random string |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp access token | Meta for Developers → WhatsApp → API Setup |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp phone number ID | Meta for Developers → WhatsApp → API Setup |

## 🟡 Optional Variables (Recommended)

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_EXPIRES_IN` | `1h` | JWT token expiration time |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token expiration |
| `NODE_ENV` | `development` | Application environment |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Application URL |

## 🟢 Production Variables (For Production)

| Variable | Description |
|----------|-------------|
| `REDIS_URL` | Redis connection URL for persistent storage |
| `SENTRY_DSN` | Sentry DSN for error tracking |
| `LOG_LEVEL` | Logging level (debug, info, warn, error) |

## 🚀 Quick Setup Commands

```bash
# 1. Copy environment file
cp env.example .env.local

# 2. Generate JWT secret
npm run generate-jwt-secret

# 3. Start development server
npm run dev
```

## 🔍 Verification Checklist

- [ ] Supabase credentials are set
- [ ] JWT secret is generated and set
- [ ] WhatsApp credentials are configured
- [ ] Webhook is configured in Meta
- [ ] Database migration is applied
- [ ] Application starts without errors
- [ ] WhatsApp messages are received
- [ ] Authentication flow works end-to-end
