/**
 * Playbook data loader
 *
 * Loads playbook files from the package directory.
 * Works in both Node.js and bundler environments.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Playbook, PlaybookMetadata } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Go up from dist/ to package root
const PACKAGE_ROOT = join(__dirname, '..');

export const PLAYBOOK_IDS = [
  'critique-refine',
  'doc-editor',
  'investigate-fix',
  'observe-code',
  'plan-build',
  'test-implement',
] as const;

export type PlaybookId = typeof PLAYBOOK_IDS[number];

/**
 * List all available playbook IDs (active only by default)
 */
export function listPlaybookIds(activeOnly = true): string[] {
  return PLAYBOOK_IDS.filter((id) => {
    if (!activeOnly) return true;

    const metadataPath = join(PACKAGE_ROOT, id, 'playbook.json');
    if (!existsSync(metadataPath)) return false;

    try {
      const content = readFileSync(metadataPath, 'utf-8');
      const metadata = JSON.parse(content) as PlaybookMetadata;
      return metadata.active !== false;
    } catch {
      return false;
    }
  });
}

/**
 * Load a specific playbook by ID
 */
export function loadPlaybook(playbookId: string): Playbook | null {
  const playbookDir = join(PACKAGE_ROOT, playbookId);

  if (!existsSync(playbookDir)) {
    console.error(`[playbooks] Playbook directory not found: ${playbookDir}`);
    return null;
  }

  try {
    // Load metadata
    const metadataPath = join(playbookDir, 'playbook.json');
    const metadataContent = readFileSync(metadataPath, 'utf-8');
    const metadata: PlaybookMetadata = JSON.parse(metadataContent);

    // Load protocol
    const protocolPath = join(playbookDir, 'protocol.md');
    const protocol = existsSync(protocolPath)
      ? readFileSync(protocolPath, 'utf-8')
      : '';

    // Load role prompts
    const rolePrompts: Record<string, string> = {};
    for (const role of metadata.roles) {
      const promptPath = join(playbookDir, role.prompt_file);
      if (existsSync(promptPath)) {
        rolePrompts[role.id] = readFileSync(promptPath, 'utf-8');
      }
    }

    return {
      metadata,
      protocol,
      role_prompts: rolePrompts,
    };
  } catch (error) {
    console.error(`[playbooks] Error loading playbook: ${playbookId}`, error);
    return null;
  }
}

/**
 * Load all active playbooks
 */
export function loadAllPlaybooks(): Playbook[] {
  const ids = listPlaybookIds();
  const playbooks: Playbook[] = [];

  for (const id of ids) {
    const playbook = loadPlaybook(id);
    if (playbook) {
      playbooks.push(playbook);
    }
  }

  return playbooks;
}
