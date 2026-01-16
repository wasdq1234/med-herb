/**
 * Generate seed.sql from seed.ts
 * Run: npx tsx scripts/generate-seed-sql.ts > drizzle/seed.sql
 */

import { generateSeedSQL, generateTreatmentAxisSQL } from '../src/db/seed';

console.log('-- Seed Data SQL --\n');
console.log(generateSeedSQL());
console.log('\n-- Treatment Axis SQL --\n');
console.log(generateTreatmentAxisSQL());
