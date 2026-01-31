/**
 * @hotwired-sh/playbooks
 *
 * Playbook definitions for Hotwired multi-agent workflows.
 *
 * @example Loading playbooks
 * ```typescript
 * import { loadAllPlaybooks, loadPlaybook } from '@hotwired-sh/playbooks';
 *
 * const playbooks = loadAllPlaybooks();
 * const playbook = loadPlaybook('plan-build');
 * ```
 *
 * @example Creating custom playbooks
 * ```typescript
 * import type { PlaybookMetadata, PlaybookRole } from '@hotwired-sh/playbooks';
 * import { validatePlaybook } from '@hotwired-sh/playbooks';
 *
 * // Validate your playbook directory
 * const result = validatePlaybook('./my-playbook');
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */

// Types
export type {
  Playbook,
  PlaybookMetadata,
  PlaybookRole,
  PlaybooksManifest,
  ValidationResult,
} from './types.js';

// Data loading
export {
  loadAllPlaybooks,
  loadPlaybook,
  listPlaybookIds,
  PLAYBOOK_IDS,
  type PlaybookId,
} from './data.js';

// Validation
export {
  validatePlaybook,
  validateAllPlaybooks,
} from './validate.js';
