/**
 * @hotwired-sh/playbooks
 *
 * Playbook definitions for Hotwired multi-agent workflows.
 *
 * Usage:
 *   import { Playbook, PlaybookMetadata } from '@hotwired-sh/playbooks';
 *   import { loadAllPlaybooks } from '@hotwired-sh/playbooks/data';
 */

export type {
  Playbook,
  PlaybookMetadata,
  PlaybookRole,
  PlaybooksManifest,
} from './types.js';

// Re-export the data loader
export { loadAllPlaybooks, loadPlaybook, listPlaybookIds, PLAYBOOK_IDS } from './data.js';
