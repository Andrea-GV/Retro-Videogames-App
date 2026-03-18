# Retro Videogames App

## 📋 Overview

**Retro Videogames App** is a comprehensive catalog management system for retro video games. Built with modern web technologies, it allows users to explore, browse, and manage a collection of classic games across different platforms and genres. The application integrates with a robust PostgreSQL database managed through Prisma ORM, ensuring data integrity and performance.

### What is it?

A full-stack web application where you can:

- Browse and search through a catalog of retro video games
- Filter games by platform, genre, and publisher
- Create and manage game entries with detailed information
- Build and organize your personal game library
- Track game availability across different shops

### Why was it created?

This project was developed as a practical learning experience in modern full-stack web development, focusing on architecting scalable applications with complex data relationships and implementing industry-standard practices for API development and database management. It serves as a portfolio project demonstrating proficiency in contemporary web technologies and development workflows.

### Main Objectives

✅ Build a fully functional CRUD application for comprehensive game management  
✅ Design and optimize a relational database schema handling complex entity relationships  
✅ Implement RESTful API endpoints with proper error handling  
✅ Create an intuitive and responsive user interface  
✅ Practice database migrations and schema evolution  
✅ Demonstrate API testing and validation techniques

---

## 🛠️ Technical Architecture

### Tech Stack

**Frontend & Framework:**

- [Next.js 13+](https://nextjs.org) - React framework with App Router
- React 18+ - Component-based UI
- TypeScript - Type-safe development
- SCSS Modules - Component-scoped styling

**Backend & API:**

- Node.js - Runtime environment
- Next.js API Routes - Serverless API endpoints
- TypeScript - Type definitions for safety
- RESTful design patterns

**Database & ORM:**

- PostgreSQL - Relational database
- [Prisma ORM](https://www.prisma.io) - Type-safe database access
- Prisma Client - Auto-generated database client
- Schema migrations for version control

**Development & Testing:**

- Postman - API testing and documentation
- ESLint - Code quality
- Node Package Manager (npm) - Dependency management

### Project Structure

```
app/
├── (pages)/                    # UI pages and layouts
│   ├── games/                  # Game listing and detail pages
│   ├── publishers/             # Publisher management
│   └── (CRUD)/                 # Create and edit operations
├── api/                        # Backend API routes
│   ├── games/                  # Game CRUD operations
│   │   ├── route.ts           # GET all, POST new
│   │   └── [id]/route.ts      # GET by ID, PUT, DELETE
│   └── test-db/               # Database testing endpoint
├── components/                # Reusable React components
│   ├── Form/                  # Form handling components
│   ├── Games/                 # Game-specific components
│   └── UI/                    # Common UI elements
└── services-controller/       # Business logic & database queries

prisma/
└── schema.prisma              # Database schema definition

lib/
├── db.ts                       # Database connection
├── prisma.ts                   # Prisma client instance
└── baseURL.js                  # API configuration
```

### API Endpoints

#### Games Management

| Method | Endpoint          | Description                  |
| ------ | ----------------- | ---------------------------- |
| GET    | `/api/games`      | Fetch all games with filters |
| POST   | `/api/games`      | Create a new game entry      |
| GET    | `/api/games/[id]` | Get game details by ID       |
| PUT    | `/api/games/[id]` | Update game information      |
| DELETE | `/api/games/[id]` | Remove a game from catalog   |

#### Database Validation

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| GET    | `/api/test-db` | Verify database connection |

### Database Schema Highlights

The Prisma schema defines the following main entities:

- **Game** - Core game information (title, release year, description)
- **Platform** - Gaming consoles/systems (NES, SNES, Genesis, etc.)
- **Genre** - Game categories (RPG, Action, Adventure, etc.)
- **Publisher** - Game developers and publishers
- **Shop** - Retail outlets and digital stores
- **Library** - User's personal game collection
- **User** - Application users and accounts

Relationships are managed through junction tables (GamePlatform, GameGenre, GameShop) to support many-to-many associations.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- PostgreSQL database
- Postman (optional, for API testing)

### Installation & Development

1. **Clone and install dependencies:**

   ```bash
   git clone <repository>
   cd retro-games
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   # Create .env.local file with database connection
   DATABASE_URL="postgresql://user:password@localhost:5432/retro_games"
   ```

3. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. **Access the application:**
   - UI: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3000/api](http://localhost:3000/api)

### Testing APIs with Postman

1. Open Postman and create a new collection
2. Add requests to test endpoints:
   - **GET** `http://localhost:3000/api/games` - List all games
   - **POST** `http://localhost:3000/api/games` - Create new game
   - **GET** `http://localhost:3000/api/games/1` - Get game by ID
   - **PUT** `http://localhost:3000/api/games/1` - Update game
   - **DELETE** `http://localhost:3000/api/games/1` - Delete game

3. Use the request body for POST/PUT operations with JSON game data

### Database Management

```bash
# Open Prisma Studio (visual database explorer)
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name descriptive_change_name

# Reset database (development only)
npx prisma migrate reset
```

---

## 📝 Development Notes

- Currently on `migration_db` branch for database schema optimization
- API validation and error handling in progress
- Implementing comprehensive API documentation
- Schema relationships support complex game metadata (platforms, genres, publishers, shops)

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Postman Documentation](https://learning.postman.com)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
