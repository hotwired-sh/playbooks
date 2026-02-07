/**
 * Bundle all playbooks into a single JSON file for browser/bundler usage
 *
 * This script reads all playbook directories and outputs a single JSON file
 * containing all playbook data (metadata, protocol, role prompts) along with
 * package information for source attribution.
 *
 * The output file (dist/playbooks.json) can be fetched from CDN:
 * https://unpkg.com/@hotwired-sh/playbooks/dist/playbooks.json
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Playbook, PlaybookMetadata, PlaybooksManifest, PackageInfo } from '../src/types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const PLAYBOOKS_DIR = join(ROOT_DIR, 'playbooks');
const DIST_DIR = join(ROOT_DIR, 'dist');
const OUTPUT_FILE = join(DIST_DIR, 'playbooks.json');
const PACKAGE_JSON = join(ROOT_DIR, 'package.json');

const PLAYBOOK_IDS = ['architect-team', 'doc-editor', 'plan-build'];

function loadPackageInfo(): PackageInfo {
  const content = readFileSync(PACKAGE_JSON, 'utf-8');
  const pkg = JSON.parse(content);

  return {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    // Official packages are in the @hotwired-sh scope
    isOfficial: pkg.name.startsWith('@hotwired-sh/'),
    homepage: pkg.homepage,
    repository: typeof pkg.repository === 'string'
      ? pkg.repository
      : pkg.repository?.url?.replace(/^git\+/, '').replace(/\.git$/, ''),
  };
}

function loadPlaybook(playbookId: string): Playbook | null {
  const playbookDir = join(PLAYBOOKS_DIR, playbookId);

  if (!existsSync(playbookDir)) {
    console.error(`[bundle] Playbook directory not found: ${playbookDir}`);
    return null;
  }

  try {
    // Load metadata
    const metadataPath = join(playbookDir, 'playbook.json');
    const metadataContent = readFileSync(metadataPath, 'utf-8');
    const metadata: PlaybookMetadata = JSON.parse(metadataContent);

    // Skip inactive playbooks
    if (metadata.active === false) {
      console.log(`[bundle] Skipping inactive playbook: ${playbookId}`);
      return null;
    }

    // Load protocol
    const protocolPath = join(playbookDir, 'protocol.md');
    const protocol = existsSync(protocolPath)
      ? readFileSync(protocolPath, 'utf-8')
      : '';

    // Load role prompts
    const rolePrompts: Record<string, string> = {};
    for (const role of metadata.roles) {
      if (role.promptFile) {
        const promptPath = join(playbookDir, role.promptFile);
        if (existsSync(promptPath)) {
          rolePrompts[role.id] = readFileSync(promptPath, 'utf-8');
        }
      }
    }

    // Load templates from templates/ directory
    const templates: Record<string, string> = {};
    const templatesDir = join(playbookDir, 'templates');
    if (existsSync(templatesDir)) {
      const templateFiles = readdirSync(templatesDir).filter(f => f.endsWith('.md'));
      for (const file of templateFiles) {
        const templateName = basename(file, '.md');
        const templatePath = join(templatesDir, file);
        templates[templateName] = readFileSync(templatePath, 'utf-8');
      }
    }

    return {
      metadata,
      protocol,
      role_prompts: rolePrompts,
      templates: Object.keys(templates).length > 0 ? templates : undefined,
    };
  } catch (error) {
    console.error(`[bundle] Error loading playbook: ${playbookId}`, error);
    return null;
  }
}

function main() {
  console.log('[bundle] Bundling playbooks...');

  // Ensure dist directory exists
  if (!existsSync(DIST_DIR)) {
    mkdirSync(DIST_DIR, { recursive: true });
  }

  // Load package info
  const packageInfo = loadPackageInfo();
  console.log(`[bundle] Package: ${packageInfo.name}@${packageInfo.version}`);

  // Load all playbooks
  const playbooks: Playbook[] = [];
  for (const id of PLAYBOOK_IDS) {
    const playbook = loadPlaybook(id);
    if (playbook) {
      playbooks.push(playbook);
      console.log(`[bundle] ✓ ${id}`);
    }
  }

  // Create manifest
  const manifest: PlaybooksManifest = {
    package: packageInfo,
    playbooks,
    buildTime: Date.now(),
    schemaVersion: 1,
  };

  // Write output
  writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`[bundle] Written ${playbooks.length} playbooks to ${OUTPUT_FILE}`);
}

main();
