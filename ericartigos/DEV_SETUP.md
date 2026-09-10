# Development Setup Guide — Ericartigos Restaurant System

## Prerequisites

- **Node.js** 18.x or 20.x (LTS recommended)
- **Docker** and **Docker Compose** (for local MySQL)
- **npm** 9.x or higher

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Local MySQL Database

```bash
docker-compose up -d
```

This starts a MySQL 8.0 container with the database `ericartigos` pre-created. The database persists in a volume called `ericartigos_mysql_data` even after stopping containers.

**Verify MySQL is running:**
```bash
mysql -u root -proot -h localhost -e "SHOW DATABASES;"
```

You should see `ericartigos` in the list.

### 3. Set Up Database Schema

```bash
npm run db:push
```

This creates all tables in your local MySQL database based on `prisma/schema.prisma`.

### 4. Seed Test Data

```bash
npm run db:seed
```

This populates your database with realistic test data:
- 3 users: owner, admin, supervisor (all with password `password123`)
- 5 menu categories with 20 menu items
- 10 inventory items

**Credentials for Testing:**
- **Owner:** `owner@test.com / password123`
- **Admin:** `admin@test.com / password123`
- **Supervisor:** `supervisor@test.com / password123`

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server (hot reload) |
| `npm run build` | Build for production |
| `npm run start` | Run production build locally |
| `docker-compose up -d` | Start MySQL container in background |
| `docker-compose down` | Stop MySQL container |
| `npm run db:push` | Sync Prisma schema with database |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:seed` | Populate database with test data |
| `npx prisma studio` | Open Prisma Studio (visual database explorer) |

---

## Database Management

### View Data with Prisma Studio

```bash
npx prisma studio
```

This opens a web UI where you can browse all database tables, add/edit/delete records.

### Reset Database (Start Fresh)

```bash
# Stop the container
docker-compose down

# Remove the volume (deletes all data)
docker volume rm ericartigos_mysql_data

# Start fresh
docker-compose up -d
npm run db:push
npm run db:seed
```

### Connect with MySQL CLI

```bash
mysql -u root -proot -h localhost ericartigos
```

### Connect with GUI (MySQL Workbench, DBeaver, etc.)

**Connection Details:**
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `root`
- Database: `ericartigos`

---

## Project Structure

```
ericartigos/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── api-utils.ts     # API guard utilities
│   │   ├── errors.ts        # Custom error classes
│   │   └── prisma.ts        # Prisma client singleton
│   ├── types/
│   │   └── index.ts         # Shared TypeScript types
│   └── middleware.ts        # Route protection
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Test data seeder
├── docker-compose.yml       # Local MySQL setup
├── .env.local               # Development environment variables
└── package.json
```

---

## Troubleshooting

### MySQL Connection Refused

**Problem:** Can't connect to localhost:3306

**Solutions:**
1. Ensure Docker is running: `docker ps`
2. Ensure container is up: `docker-compose ps` (should show MySQL as `Up`)
3. Restart the container: `docker-compose restart mysql`
4. Check MySQL logs: `docker-compose logs mysql`

### Prisma Client Out of Sync

**Problem:** "Prisma Client doesn't match the schema"

**Solution:**
```bash
npm run db:generate
```

### Database Lock Errors

**Problem:** "Table is locked" errors during seed

**Solution:**
```bash
docker-compose restart mysql
npm run db:push
npm run db:seed
```

### Port 3306 Already in Use

**Problem:** Another MySQL instance is running

**Solutions:**
1. Stop other MySQL services
2. Or change the port in `docker-compose.yml`: change `3306:3306` to `3307:3306`

---

## Environment Variables

`.env.local` contains sensitive development credentials. **Never commit this file.**

For production deployment, set environment variables on your hosting platform (Vercel, etc.).

See `.env.production.example` for the production template.

---

## Next Steps

After setup is complete:
1. Visit `/login` and log in with one of the test credentials
2. Explore the dashboard (features being built)
3. Read `SYSTEM_BLUEPRINT.md` for the full architecture
4. Start building features using the API guard utilities and shared types

---

## Getting Help

- Check logs: `docker-compose logs mysql`
- Reset everything: `docker-compose down && docker volume rm ericartigos_mysql_data && docker-compose up -d && npm run db:push && npm run db:seed`
- Ask your team or check the main README.md

Happy coding! 🚀
