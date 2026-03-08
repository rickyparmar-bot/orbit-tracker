#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#   🌉 ORBIT BRIDGE — Scheduled Auto-Sync
#   Runs pw-bridge.ts on a schedule to pull PW Live data
#   Electric Purple Terminal Vibe (#8e44ad)
# ═══════════════════════════════════════════════════════════════

PURPLE='\033[38;2;142;68;173m'
BOLD='\033[1m'
RESET='\033[0m'
GREEN='\033[38;2;46;204;113m'
RED='\033[38;2;231;76;60m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/bridge-sync-$(date +%Y%m%d).log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

echo -e "${PURPLE}${BOLD}[BRIDGE-CRON]${RESET} ${PURPLE}Starting scheduled sync at $(date '+%Y-%m-%d %H:%M:%S IST')${RESET}" | tee -a "$LOG_FILE"

# Change to project directory
cd "$PROJECT_DIR" || {
    echo -e "${RED}[BRIDGE-CRON] ❌ Failed to cd into $PROJECT_DIR${RESET}" | tee -a "$LOG_FILE"
    exit 1
}

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}[BRIDGE-CRON] ❌ No .env file found — cannot run live sync${RESET}" | tee -a "$LOG_FILE"
    echo -e "${PURPLE}[BRIDGE-CRON] Copy .env.example to .env and add credentials${RESET}" | tee -a "$LOG_FILE"
    exit 1
fi

# Run the bridge (live mode, headless)
echo -e "${PURPLE}${BOLD}[BRIDGE-CRON]${RESET} ${PURPLE}Executing bridge sync...${RESET}" | tee -a "$LOG_FILE"
npx tsx scripts/pw-bridge.ts 2>&1 | tee -a "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}[BRIDGE-CRON] ✅ Sync completed successfully!${RESET}" | tee -a "$LOG_FILE"
else
    echo -e "${RED}[BRIDGE-CRON] ❌ Sync failed with exit code $EXIT_CODE${RESET}" | tee -a "$LOG_FILE"
fi

echo -e "${PURPLE}${BOLD}[BRIDGE-CRON]${RESET} ${PURPLE}Log saved to $LOG_FILE${RESET}" | tee -a "$LOG_FILE"
