/**
 * Schema version tracking and migration runner
 *
 * Runs registered migrations in order, only once per version.
 * Called from main.jsx before the React app renders.
 */

import { migrateV1SupplierFields } from './migrations/v1_supplierFields';
import { initializeSuppliers } from './supplierHelpers';

const SCHEMA_VERSION_KEY = 'adorable-schema-version';

// Registry: version number -> migration function
const migrations = {
  1: migrateV1SupplierFields
};

/**
 * Run all pending migrations, then initialize suppliers.
 * Safe to call multiple times -- already-run versions are skipped.
 */
export function runMigrations() {
  const currentVersion = parseInt(localStorage.getItem(SCHEMA_VERSION_KEY) || '0', 10);
  const versionKeys = Object.keys(migrations).map(Number);
  const targetVersion = Math.max(...versionKeys);

  if (currentVersion < targetVersion) {
    for (let v = currentVersion + 1; v <= targetVersion; v++) {
      if (migrations[v]) {
        migrations[v]();
      }
    }
    localStorage.setItem(SCHEMA_VERSION_KEY, String(targetVersion));
    console.log(`[Migration] Schema updated to v${targetVersion}`);
  }

  // Always ensure suppliers are seeded (idempotent)
  initializeSuppliers();
}
