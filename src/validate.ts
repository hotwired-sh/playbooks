/**
 * Playbook validation utilities
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { PlaybookMetadata, ValidationResult } from './types.js';

/**
 * Validate a playbook directory
 */
export function validatePlaybook(playbookDir: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check playbook.json exists
  const metadataPath = join(playbookDir, 'playbook.json');
  if (!existsSync(metadataPath)) {
    errors.push('Missing playbook.json');
    return { valid: false, errors, warnings };
  }

  // Parse and validate playbook.json
  let metadata: PlaybookMetadata;
  try {
    const content = readFileSync(metadataPath, 'utf-8');
    metadata = JSON.parse(content);
  } catch (e) {
    errors.push(`Invalid playbook.json: ${e instanceof Error ? e.message : String(e)}`);
    return { valid: false, errors, warnings };
  }

  // Required fields
  const requiredFields = ['id', 'name', 'tagline', 'description', 'icon', 'roles', 'flow', 'humanRole', 'bestFor'];
  for (const field of requiredFields) {
    if (!(field in metadata)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate id format
  if (metadata.id && !/^[a-z][a-z0-9-]*$/.test(metadata.id)) {
    errors.push(`Invalid id format: "${metadata.id}" (must be kebab-case)`);
  }

  // Validate roles
  if (Array.isArray(metadata.roles)) {
    if (metadata.roles.length === 0) {
      errors.push('Playbook must have at least one role');
    }

    const roleIds = new Set<string>();
    for (const role of metadata.roles) {
      // Check for duplicate role IDs
      if (roleIds.has(role.id)) {
        errors.push(`Duplicate role id: "${role.id}"`);
      }
      roleIds.add(role.id);

      // Check role id format
      if (!/^[a-z][a-z0-9-]*$/.test(role.id)) {
        errors.push(`Invalid role id format: "${role.id}" (must be kebab-case)`);
      }

      // Check prompt file exists
      if (role.promptFile) {
        const promptPath = join(playbookDir, role.promptFile);
        if (!existsSync(promptPath)) {
          errors.push(`Missing prompt file for role "${role.id}": ${role.promptFile}`);
        }
      } else {
        errors.push(`Missing promptFile for role "${role.id}"`);
      }
    }
  }

  // Check for protocol.md (warning if missing)
  const protocolPath = join(playbookDir, 'protocol.md');
  if (!existsSync(protocolPath)) {
    warnings.push('Missing protocol.md (recommended for shared agent instructions)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate all playbooks in a directory
 */
export function validateAllPlaybooks(playbooksDir: string): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>();

  const entries = readdirSync(playbooksDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const playbookPath = join(playbooksDir, entry.name);
      results.set(entry.name, validatePlaybook(playbookPath));
    }
  }

  return results;
}
