# TONnectA Setup Guide

## 1. TON Connect Integration

1. Update the manifest URL in `lib/ton-connect.ts`
2. Host the `tonconnect-manifest.json` file on your domain
3. The wallet connection will open a new page/modal for TON Connect

## 2. IPFS Integration

1. Sign up for Infura IPFS service
2. Get your Project ID and Secret
3. Add them to your environment variables
4. Posts and media are now stored on IPFS

## 3. Telegram Bot Setup

1. Create a bot with @BotFather on Telegram
2. Get your bot token
3. Set webhook URL: `https://your-domain.com/api/telegram/webhook`
4. Users can now access the app through Telegram

## 4. Push Notifications

1. Generate VAPID keys for web push
2. Add them to environment variables
3. Users can enable notifications in settings
4. Notifications work across all devices

## 5. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

## 6. Deployment

1. Deploy to Vercel or your preferred platform
2. Set up environment variables in your deployment
3. Update the manifest URL and webhook URL
4. Test all integrations

## 7. Telegram Bot Commands

- `/start` - Welcome message with app button
- `/help` - Show help information
- `/app` - Direct link to open the app

The bot automatically sets up a menu button for easy access to the app.
