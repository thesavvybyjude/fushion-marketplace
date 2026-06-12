#!/bin/bash
# scripts/backup.sh
# Creates a pg_dump backup of the PostgreSQL database and tests restoration on a temporary DB.

set -e

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

DB_URL=${DATABASE_URL:-"postgresql://postgres:postgres@localhost:5432/fushion?schema=public"}
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/fushion_backup_$TIMESTAMP.sql"
TEST_DB="fushion_restore_test_$TIMESTAMP"

mkdir -p $BACKUP_DIR

echo "==> Creating backup from: $DB_URL"
pg_dump "$DB_URL" -F p -f "$BACKUP_FILE"
echo "✅ Backup created successfully: $BACKUP_FILE"

echo "==> Testing restoration..."
# Create test database
psql "$DB_URL" -c "CREATE DATABASE $TEST_DB;"

# Construct restore URL by replacing database name
RESTORE_URL=$(echo $DB_URL | sed -E "s|/[^/?]+(\?.*)?$|/$TEST_DB\1|")

# Restore backup to test database
psql "$RESTORE_URL" -f "$BACKUP_FILE" > /dev/null
echo "✅ Restoration test successful"

# Clean up test database
psql "$DB_URL" -c "DROP DATABASE $TEST_DB;"
echo "✅ Test database dropped"

echo "Backup verified and ready!"
