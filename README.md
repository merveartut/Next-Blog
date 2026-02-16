# 🖋️ Be Log

**Be Log** is a minimalist, high-performance personal blog platform designed with a "digital typewriter" aesthetic. Built with **Next.js 15**, it combines modernist architecture-inspired UI with advanced features like dynamic image processing, and seamless social media integration.

## 🎉💥 Project on live [here](https://www.thebelog.com) !

---

## ✨ Features

- **Modular Architecture:** Component based structure
- **Next.js 15 App Router:** Leveraging the latest React Server Components and Server Actions for optimized performance and SEO.
- **CKEditor 5 Integration:** A customized rich-text editor featuring custom image upload adapters.
- **Responsive & Brutalist Design:** Fully responsive layouts with high-fidelity typography, interactive tooltips, and line-clamp optimizations.
- **PostgreSQL & Prisma:** Robust data management with a focus on relational integrity and fast query execution.
- **Auth System:** Secure authentication via NextAuth.js for administrative content management.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS (with Typography Plugin)
- **Authentication:** NextAuth.js
- **Rich Text Editor:** CKEditor 5
- **Image Hosting:** Supabase Storage (Integration ready)

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone [https://github.com/merveartut/Next-Blog.git](https://github.com/merveartut/Next-Blog.git)
cd Next-Blog
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
```bash
DATABASE_URL="postgresql://user:password@host:port/dbname?pgbouncer=true&statement_cache_size=0"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
# Supabase storage credentials for image uploads
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Database Setup
```bash
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.

### 🏗️ Architecture Detail

The project follows a clean and modular Next.js App Router structure:

* /app: Contains all pages, layouts, and API routes (/api) for backend operations.

* /components: Modular UI elements like FilteredPostList, Editor, and ShareStoryButton.

* /lib: Library configurations and singleton instances for Prisma and NextAuth.

* /public: Static assets, including site-wide images and placeholders.

* /hooks: Custom React hooks for managing global states like loading and context.

