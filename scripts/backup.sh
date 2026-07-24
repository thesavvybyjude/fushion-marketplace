#!/bin/bash
set -euo pipefail

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/fushion_backup_$TIMESTAMP.sql"
TEST_DB="fushion_restore_test_$TIMESTAMP"

DB_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/fushion?schema=public}"

mkdir -p "$BACKUP_DIR"

echo "==> Creating backup..."
pg_dump "$DB_URL" -F p -f "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"

echo "==> Testing restoration..."
psql "$DB_URL" -c "CREATE DATABASE $TEST_DB;"

RESTORE_URL=$(echo "$DB_URL" | sed -E "s|/[^/?]+(\?.*)?$|/$TEST_DB\1|")

psql "$RESTORE_URL" -f "$BACKUP_FILE" > /dev/null
echo "Restoration test successful"

psql "$DB_URL" -c "DROP DATABASE $TEST_DB;"
echo "Test database cleaned up"
