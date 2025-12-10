# Google OAuth Setup Instructions

Follow these steps to enable Google sign-in for your PinBoard app:

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** or **People API** for your project

## 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: PinBoard
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add scopes (optional): `email`, `profile`, `openid`
5. Save and continue

## 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: PinBoard Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local development)
     - Your production URL (e.g., `https://yourapp.vercel.app`)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (for local)
     - `https://yourapp.vercel.app/api/auth/callback/google` (for production)
5. Click **Create**

## 4. Copy Your Credentials

After creating the OAuth client, you'll see:
- **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123xyz`)

## 5. Update Environment Variables

### Local Development (.env.local)
Add your credentials to `.env.local`:

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"
```

### Production (Vercel)
Add the same variables in your Vercel project settings:
1. Go to your project on Vercel
2. Navigate to **Settings** > **Environment Variables**
3. Add:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (your production URL)
4. Redeploy your app

## 6. Test Sign In

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signin`
3. Click **Continue with Google**
4. Sign in with your Google account
5. You should be redirected to `/feed` after successful authentication

## Notes

- When users sign in with Google for the first time, a `username` will be auto-generated from their Google profile
- The Prisma adapter handles account linking automatically
- Google profile images are stored in the `image` field of the User model
- Email from Google is stored in the `email` field

## Troubleshooting

**Error: redirect_uri_mismatch**
- Ensure your authorized redirect URIs in Google Cloud Console match exactly:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://your-domain.com/api/auth/callback/google`

**Error: invalid_client**
- Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`

**Users can't sign in**
- Verify the OAuth consent screen is published (not in testing mode)
- Check that the user's email is added to test users if in testing mode
