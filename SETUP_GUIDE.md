# Setup Guide for BulletinConnect

This guide will help you set up BulletinConnect from scratch.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Database Setup

### Option A: PostgreSQL (Recommended for Production)

1. **Install PostgreSQL** if you haven't already:
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create a database**:
   ```bash
   # Login to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE bulletinconnect;
   
   # Create user (optional)
   CREATE USER bulletinuser WITH PASSWORD 'yourpassword';
   GRANT ALL PRIVILEGES ON DATABASE bulletinconnect TO bulletinuser;
   
   # Exit
   \q
   ```

3. **Update your `.env` file**:
   ```env
   DATABASE_URL="postgresql://bulletinuser:yourpassword@localhost:5432/bulletinconnect"
   ```

### Option B: SQLite (Quick Testing)

For quick local development, you can use SQLite:

1. **Update your `.env` file**:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. **Update `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

## Step 3: Configure Authentication

1. **Generate NextAuth secret**:
   ```bash
   openssl rand -base64 32
   ```

2. **Add to `.env`**:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<your-generated-secret>"
   ```

## Step 4: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Open Prisma Studio to view data
npx prisma studio
```

## Step 5: Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Step 6: Create Your First User

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Create Account"
3. Fill in your details
4. Sign in with your credentials

## Optional: UploadThing Setup (for image/video uploads)

1. **Create account** at [uploadthing.com](https://uploadthing.com)
2. **Get your API keys** from the dashboard
3. **Add to `.env`**:
   ```env
   UPLOADTHING_SECRET="your_secret"
   UPLOADTHING_APP_ID="your_app_id"
   ```

## Troubleshooting

### "Unable to acquire lock" error
```bash
# Remove the lock file
Remove-Item -Path ".next/dev/lock" -Force

# Or on Mac/Linux
rm -f .next/dev/lock

# Then restart the server
npm run dev
```

### Database connection errors
- Check that PostgreSQL is running
- Verify your DATABASE_URL is correct
- Ensure the database exists
- Check user permissions

### Build errors
```bash
# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Rebuild
npm run build
```

### Prisma errors
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

## Production Deployment

### Environment Variables
Set the following in your production environment:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret"
UPLOADTHING_SECRET="..."
UPLOADTHING_APP_ID="..."
```

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

The database will need to be hosted separately (e.g., Neon, Supabase, Railway).

## Next Steps

- Customize the UI colors in `tailwind.config.ts`
- Add more bulletin boards
- Invite friends to join
- Implement real-time features with Socket.io
- Add image/video upload with UploadThing

## Support

If you encounter any issues, please check:
1. Node.js version (needs 18+)
2. Database connection
3. Environment variables are set correctly
4. All dependencies are installed

For more help, open an issue on GitHub.
