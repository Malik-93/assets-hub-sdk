const fs = require('fs');
const path = require('path');

/**
 * This script handles the injection and reversion of the base URL.
 * It reads from a local .env file or environment variables.
 */

const TARGET_FILE = path.join(__dirname, '../src/client.ts');
const ENV_FILE = path.join(__dirname, '../.env');
const ENV_VAR = 'ASSET_HUB_BASE_URL';
const PLACEHOLDER = '__ASSET_HUB_BASE_URL_PLACEHOLDER__';

// Helper to parse .env file manually (to avoid extra dependencies)
function getEnvValue() {
  // 1. Check process.env first
  if (process.env[ENV_VAR]) return process.env[ENV_VAR];

  // 2. Check .env file
  if (fs.existsSync(ENV_FILE)) {
    const lines = fs.readFileSync(ENV_FILE, 'utf8').split('\n');
    for (const line of lines) {
      const [key, ...valueParts] = line.split('=');
      if (key && key.trim() === ENV_VAR) {
        return valueParts.join('=').trim();
      }
    }
  }
  return null;
}

function run() {
  const isRevert = process.argv.includes('--revert');
  const value = getEnvValue();

  if (!isRevert && !value) {
    console.error(`[Inject] Error: ${ENV_VAR} not found in .env or environment.`);
    process.exit(1);
  }

  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`[Inject] Target file not found: ${TARGET_FILE}`);
    process.exit(1);
  }

  let content = fs.readFileSync(TARGET_FILE, 'utf8');

  if (isRevert) {
    // REVERSION MODE: Search for the injected URL and swap it back to the placeholder
    // We look for: const DEFAULT_BASE_URL = "URL";
    const regex = new RegExp(`const DEFAULT_BASE_URL = "[^"]+";`);
    const replacement = `const DEFAULT_BASE_URL = "${PLACEHOLDER}";`;
    
    if (!content.match(regex)) {
        console.log(`[Inject] Reversion skipped: URL format not found or already a placeholder.`);
        return;
    }

    console.log(`[Inject] Reverting source code to placeholder...`);
    content = content.replace(regex, replacement);
  } else {
    // INJECTION MODE: Swap placeholder for real URL
    if (!content.includes(PLACEHOLDER)) {
      console.log(`[Inject] Injection skipped: Placeholder not found (might already be injected).`);
      return;
    }

    console.log(`[Inject] Injecting secret: ${value}`);
    content = content.replace(PLACEHOLDER, value);
  }

  fs.writeFileSync(TARGET_FILE, content, 'utf8');
  console.log(`[Inject] ${isRevert ? 'Reversion' : 'Injection'} successful.`);
}

run();
