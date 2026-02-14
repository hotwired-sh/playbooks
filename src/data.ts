/**
 * Playbook data loader
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Playbook, PlaybookMetadata } from './types.js';

// Note: Do NOT use __dirname as variable name - esbuild adds its own shim
// which causes "Identifier already declared" errors in Lambda bundles
const __moduleDir = dirname(fileURLToPath(import.meta.url));

// Go up from dist/ to package root, then into playbooks/
const PLAYBOOKS_DIR = join(__moduleDir, '..', 'playbooks');

export const PLAYBOOK_IDS = [
  'architect-team',
  'doc-editor',
  'plan-build',
] as const;

export type PlaybookId = typeof PLAYBOOK_IDS[number];

/**
 * List all available playbook IDs (active only by default)
 */
export function listPlaybookIds(activeOnly = true): string[] {
  return PLAYBOOK_IDS.filter((id) => {
    if (!activeOnly) return true;

    const metadataPath = join(PLAYBOOKS_DIR, id, 'playbook.json');
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
  const playbookDir = join(PLAYBOOKS_DIR, playbookId);

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

/**
 * Load a specific template from a playbook
 *
 * Templates are markdown files in the playbook's templates/ directory.
 * They provide reusable examples, formats, or boilerplate that agents
 * can reference without bloating the main role prompts.
 *
 * @param playbookId - The playbook ID (e.g., 'architect-team')
 * @param templateName - The template name without .md extension (e.g., 'delivery-plan')
 * @returns The template content, or null if not found
 */
export function loadPlaybookTemplate(playbookId: string, templateName: string): string | null {
  const templatePath = join(PLAYBOOKS_DIR, playbookId, 'templates', `${templateName}.md`);

  if (!existsSync(templatePath)) {
    return null;
  }

  try {
    return readFileSync(templatePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * List available templates for a playbook
 *
 * @param playbookId - The playbook ID
 * @returns Array of template names (without .md extension)
 */
export function listPlaybookTemplates(playbookId: string): string[] {
  const templatesDir = join(PLAYBOOKS_DIR, playbookId, 'templates');

  if (!existsSync(templatesDir)) {
    return [];
  }

  try {
    return readdirSync(templatesDir)
      .filter(f => f.endsWith('.md'))
      .map(f => basename(f, '.md'));
  } catch {
    return [];
  }
}
