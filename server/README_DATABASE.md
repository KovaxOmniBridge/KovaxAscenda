# Ascenda Platform - Database Setup Guide

## Prerequisites

1. **PostgreSQL** installed (version 12 or higher)
2. **Node.js** installed (version 18 or higher)

## Setup Steps

### 1. Install PostgreSQL

#### Windows
- Download: https://www.postgresql.org/download/windows/
- Set password for `postgres` user during installation
- Default port: 5432

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

### 2. Create Database

Connect to PostgreSQL:

```bash
# Windows (PowerShell or CMD)
psql -U postgres

# Linux/macOS
sudo -u postgres psql
```

Create database:
```sql
CREATE DATABASE ascenda_db;
\q
```

### 3. Configure Environment Variables

Copy and configure:

```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ascenda_db
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=change-to-secure-secret-in-production
JWT_EXPIRES_IN=7d

PORT=3000
NODE_ENV=development
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Create Database Schema

```bash
npm run db:setup
```

Creates all tables, indexes, views, and functions.

### 6. Populate with Initial Data

```bash
npm run db:seed
```

Inserts:
- Sample organization
- Tool categories
- Available tools
- Roles/profiles
- Test users
- Organizational structure (departments, sectors, teams, squads)

### 7. Test Users

| Email | Password | Profile | Permissions |
|-------|----------|---------|-------------|
| ceo@empresa.com | senha123 | CEO | Full access to all tools |
| diretor@empresa.com | senha123 | Director | Leadership + Directory |
| admin@empresa.com | senha123 | Administrator | Administration + Management |
| coordenador@empresa.com | senha123 | Coordinator | Coordination + Management |
| gerente@empresa.com | senha123 | Manager | Management |
| supervisor@empresa.com | senha123 | Supervisor | Supervision + Management |
| operador@empresa.com | senha123 | Operational | Operational |
| dev@empresa.com | senha123 | Developer | Dev area access |

### 8. Start Server

```bash
npm run dev
```

Available at: `http://localhost:3000`

### 9. Test API

Health check:
```bash
curl http://localhost:3000/health
```

Login test:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ceo@empresa.com","password":"senha123"}'
```

## Database Structure

### Main Tables

- **organizations**: Companies (multi-tenant)
- **users**: System users
- **tool_categories**: Tool categories (Leadership, Directory, etc.)
- **tools**: Available tools
- **roles**: Access profiles
- **permissions**: Specific permissions
- **departments**: Departments
- **sectors**: Sectors
- **teams**: Teams
- **squads**: Agile squads

### Multi-Tenant System

All main tables linked to `organization_id`:
- Multiple companies in same database
- Complete data isolation between organizations
- Enterprise scalability

### Permission System

Two-layer system:

1. **Roles (Profiles)**: Group permissions and categories
2. **Direct Permissions**: User can have individual permissions that override roles

Example:
```javascript
// Via Role
user → user_roles → role → role_tool_categories → categories

// Via Direct Permission
user → user_tool_categories → categories
```

## Troubleshooting

### PostgreSQL connection error
- Check if PostgreSQL is running
- Verify credentials in `.env`
- Test connection: `psql -U postgres -d ascenda_db`

### Schema creation error
- Verify `ascenda_db` database exists
- Ensure you have proper permissions
- Try recreating database:
  ```sql
  DROP DATABASE ascenda_db;
  CREATE DATABASE ascenda_db;
  ```

### Data population error
- Run `npm run db:setup` first
- Seed has automatic `TRUNCATE`
- Check error logs for details

## Maintenance

### Database Backup
```bash
pg_dump -U postgres ascenda_db > backup.sql
```

### Restore Backup
```bash
psql -U postgres ascenda_db < backup.sql
```

### Reset Database (CAUTION!)
```bash
npm run db:setup
npm run db:seed
```
