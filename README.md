# PinBoard 📌

![PinBoard Logo](./public/logo.svg)

A social media platform where real connections stick. Share, connect, and engage through digital bulletin boards that bring people together for authentic interactions.

**Repository**: [https://github.com/kellyworkos00-droid/project77](https://github.com/kellyworkos00-droid/project77)

## Features ✨

### Core Social Features
- 🔐 **User Authentication** - Sign up, sign in with NextAuth.js
- 👤 **User Profiles** - Customizable profiles with bio, followers, and activity
- 👥 **Follow System** - Follow users and build your network
- 📝 **Posts** - Share text, images, and videos
- 💬 **Comments** - Engage in conversations on posts
- ❤️ **Likes & Reactions** - Show appreciation for content
- 🔄 **Reposts** - Share posts with your followers
- 📤 **Share** - Share posts outside the platform

### Bulletin Boards
- 📋 **Create Boards** - Start communities around interests
- 🔓 **Public/Private Boards** - Control board privacy
- 🚪 **Join/Leave** - Easy membership management
- 👥 **Member Management** - Admin, moderator, and member roles
- 📊 **Board Feed** - Board-specific content streams

### Engagement Features
- 🔥 **Daily Streaks** - Track daily login streaks
- 🏆 **Leaderboards** - Compete for longest streaks
- 💌 **Direct Messaging** - Private conversations
- 🔍 **Search** - Find users and bulletin boards
- 📱 **Responsive Design** - Works on all devices

### Unique Bulletin Board Aesthetic
- 📌 **Pin Design** - Posts look like pinned notes
- 📄 **Paper Texture** - Bulletin board visual style
- 🎨 **Warm Colors** - Cork board color scheme
- ✂️ **Tape Effects** - Visual elements mimicking physical boards

## Tech Stack 🛠️

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Real-time**: Socket.io (ready for implementation)
- **File Upload**: UploadThing (configured)

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Quick Start (Development)

If you want to get started quickly without setting up PostgreSQL:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run in development mode** (uses SQLite for quick testing)
   ```bash
   # The app is already configured, just start the dev server
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Full Installation (Production Ready)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bulletinconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bulletinconnect"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # UploadThing (optional, for media uploads)
   UPLOADTHING_SECRET=""
   UPLOADTHING_APP_ID=""
   ```

   Generate a secure NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema 📊

The app uses Prisma with the following main models:

- **User** - User accounts and profiles
- **Post** - User posts with media support
- **Comment** - Post comments
- **Like** - Post likes
- **BulletinBoard** - Community boards
- **BulletinBoardMember** - Board memberships
- **Follow** - User follow relationships
- **Message** - Direct messages
- **Streak** - Daily login streaks
- **Repost** - Reposted content
- **Share** - Shared posts
- **LiveStream** - Live streaming (future)
- **Memory** - Timeline memories (future)

## Project Structure 📁

```
bulletinconnect/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── boards/            # Bulletin board pages
│   │   ├── feed/              # Main feed
│   │   ├── profile/           # User profiles
│   │   ├── search/            # Search functionality
│   │   ├── streak/            # Streak tracking
│   │   ├── messages/          # Messaging
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Navigation.tsx
│   │   ├── PostCard.tsx
│   │   ├── CreatePost.tsx
│   │   ├── JoinButton.tsx
│   │   ├── FollowButton.tsx
│   │   └── providers/
│   └── lib/
│       ├── auth.ts            # NextAuth configuration
│       └── prisma.ts          # Prisma client
├── public/                    # Static assets
├── .env                       # Environment variables
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind config
└── package.json
```

## Usage Guide 📖

### Creating an Account
1. Click "Create Account" on the landing page
2. Fill in your name, username, email, and password
3. Sign in with your credentials

### Joining Bulletin Boards
1. Navigate to "Boards" in the navigation
2. Browse available boards
3. Click on a board to view details
4. Click "Join Board" to become a member

### Creating Posts
1. Go to your feed or a bulletin board
2. Use the post creation box at the top
3. Write your content
4. Optionally add images or videos
5. Click "Post" to share

### Building Streaks
1. Visit the "Streak" page
2. Check in daily to maintain your streak
3. View the leaderboard to see top users
4. Compete for the longest streak

### Messaging Users
1. Go to "Messages" in the navigation
2. Select a user from your conversations
3. Type and send messages
4. Real-time updates (when implemented)

## Future Enhancements 🔮

- 🎥 **Live Streaming** - Go live and stream to your followers
- 📺 **Video Feed** - Scroll through videos in bulletin boards
- 🎞️ **Memories** - Relive past events and milestones
- 🔔 **Notifications** - Real-time notification system
- 📱 **Mobile App** - Native mobile applications
- 🌐 **Internationalization** - Multi-language support
- 🎨 **Themes** - Customizable color themes
- 🤖 **AI Moderation** - Content moderation tools

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the MIT License.

## Support 💬

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ by the BulletinConnect team
