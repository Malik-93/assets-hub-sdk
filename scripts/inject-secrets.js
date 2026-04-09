const fs = require('fs');
const path = require('path');

/**
 * This script replaces the placeholder in the source code with the actual 
 * base URL from environment variables during CI/CD builds.
 */

const TARGET_FILE = path.join(__dirname, '../src/client.ts');
const ENV_VAR = 'ASSET_HUB_BASE_URL';
const PLACEHOLDER = '__ASSET_HUB_BASE_URL_PLACEHOLDER__';

function inject() {
  const value = process.env[ENV_VAR];

  if (!value) {
    console.log(`[Inject] No ${ENV_VAR} found in environment. Skipping injection.`);
    return;
  }

  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`[Inject] Target file not found: ${TARGET_FILE}`);
    process.exit(1);
  }

  let content = fs.readFileSync(TARGET_FILE, 'utf8');

  if (!content.includes(PLACEHOLDER)) {
    console.log(`[Inject] Placeholder not found in ${TARGET_FILE}. It might have already been replaced.`);
    return;
  }

  console.log(`[Inject] Replacing placeholder with: ${value}`);
  const updatedContent = content.replace(PLACEHOLDER, value);
  
  fs.writeFileSync(TARGET_FILE, updatedContent, 'utf8');
  console.log('[Inject] Successfully injected secret.');
}

inject();
