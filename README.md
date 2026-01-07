# Ghost Context Exporter

Export Ghost blog posts as AI-ready context files. Select posts individually, filter by tags, or export all posts into a single markdown file optimized for AI consumption.

## Features

- **Password Protected** - Simple admin access with NextAuth
- **Post Selection** - Choose specific posts or select all
- **Tag Filtering** - Filter posts by Ghost tags
- **Markdown Export** - Download posts as formatted markdown
- **AI-Ready Format** - Optimized for AI context windows

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **UI**: React with Tailwind CSS
- **Authentication**: NextAuth.js
- **API**: Ghost Content API
- **Deployment**: Railway

## Prerequisites

- Node.js 18+ installed
- Ghost blog with Content API access
- Railway account (for deployment)

## Local Development

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Ghost API Configuration
GHOST_CONTENT_API_KEY=your_content_api_key_here
GHOST_API_URL=https://blog.iabacus.com

# Authentication
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# App Password
APP_PASSWORD=your_secure_password_here
```

Generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

3. **Run development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with your APP_PASSWORD.

## Deployment to Railway

### 1. Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/ghost-context.git
git push -u origin main
```

### 2. Deploy on Railway

- Go to [Railway.app](https://railway.app)
- Click "New Project" → "Deploy from GitHub repo"
- Select your `ghost-context` repository
- Railway will auto-detect Next.js and deploy

### 3. Configure environment variables

In Railway dashboard, add these variables:

```
GHOST_CONTENT_API_KEY=your_content_api_key
GHOST_API_URL=https://blog.iabacus.com
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://your-app.railway.app
APP_PASSWORD=your_secure_password
NODE_ENV=production
```

### 4. Redeploy

Click "Redeploy" to apply environment variables.

## Usage

1. **Sign In** - Enter your APP_PASSWORD
2. **Filter Posts** - Optionally filter by tag
3. **Select Posts** - Choose individual posts or select all
4. **Export** - Download as markdown file

## Getting Ghost API Keys

1. Go to **Ghost Admin** → **Settings** → **Integrations**
2. Create a new **Custom Integration**
3. Copy the **Content API Key**

## Project Structure

```
ghost-context/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth
│   │   ├── posts/        # Fetch posts
│   │   ├── export/       # Export logic
│   │   └── health/       # Health check
│   ├── components/       # React components
│   ├── login/            # Login page
│   ├── layout.tsx
│   ├── page.tsx          # Main app
│   └── globals.css
├── lib/
│   └── ghost.ts          # Ghost API functions
├── package.json
├── railway.toml          # Railway config
└── README.md
```

## License

MIT License

---

Built with Next.js • Powered by Ghost CMS • Deployed on Railway
