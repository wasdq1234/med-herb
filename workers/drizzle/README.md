# Database Migrations

This directory contains Drizzle ORM migrations and seed data for the med-herb project.

## Structure

```
drizzle/
├── migrations/           # Migration files
│   ├── 0001_initial.sql # Initial schema
│   └── meta/            # Drizzle metadata
├── seed.sql             # Sample seed data
└── README.md
```

## Usage

### 1. Apply Migrations to D1

Using wrangler CLI:

```bash
# From workers directory
cd workers

# Apply migration to local D1
wrangler d1 execute med-herb-db --local --file=drizzle/migrations/0001_initial.sql

# Apply migration to remote D1
wrangler d1 execute med-herb-db --file=drizzle/migrations/0001_initial.sql
```

### 2. Seed Sample Data

```bash
# Seed local D1
wrangler d1 execute med-herb-db --local --file=drizzle/seed.sql

# Seed remote D1
wrangler d1 execute med-herb-db --file=drizzle/seed.sql
```

### 3. Regenerate Seed SQL

If you modify `src/db/seed.ts`, regenerate the SQL file:

```bash
npx tsx scripts/generate-seed-sql.ts > drizzle/seed.sql
```

## Schema Overview

The initial migration creates 9 tables:

1. **admin** - Administrator accounts
2. **symptom** - Symptom master data
3. **question** - Survey questions
4. **syndrome** - Syndrome (변증) definitions
5. **treatment_axis** - Treatment approaches
6. **herb** - Herbal medicine data
7. **syndrome_herb** - Syndrome-herb relationships (M:N)
8. **diagnosis_rule** - Diagnosis logic rules
9. **diagnosis_log** - Anonymous diagnosis logs

## Sample Data

The seed file includes:

- 1 admin user (username: `admin`, password: `password123`)
- 5 symptoms (두통, 피로, 소화불량, 불면, 복통)
- 3 questions (피로감, 식욕, 수면의 질)
- 3 syndromes (기허, 담음, 어혈)
- 5 herbs (인삼, 황기, 반하, 당귀, 천궁)
- Syndrome-herb relationships
- Sample diagnosis rules

## Development Workflow

1. Modify schema in `src/db/schema.ts`
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Review generated SQL in `drizzle/migrations/`
4. Apply migration:
   ```bash
   npm run db:migrate
   ```

## Notes

- All IDs use `nanoid()` for unique string identifiers
- Timestamps are stored as ISO8601 strings
- Boolean values use INTEGER (0/1) as per SQLite convention
- JSON data is stored as TEXT columns
- Foreign key constraints are enabled

## References

- Schema definition: `workers/src/db/schema.ts`
- Database design doc: `docs/planning/04-database-design.md`
- Drizzle config: `workers/drizzle.config.ts`
