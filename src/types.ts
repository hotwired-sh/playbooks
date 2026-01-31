/**
 * Playbook type definitions
 *
 * These types define the structure of playbook configurations
 * used by the Hotwired multi-agent system.
 */

/**
 * Defines an agent role within a playbook
 */
export interface PlaybookRole {
  /** Unique identifier for the role (kebab-case, e.g., 'test-writer') */
  id: string;
  /** Display name for the role (e.g., 'Test Writer') */
  name: string;
  /** Role type identifier (e.g., 'orchestrator', 'implementer') */
  role: string;
  /** Description of what this role does */
  description: string;
  /** Filename of the prompt markdown file (e.g., 'writer.md') */
  promptFile: string;
  /** Role capabilities */
  capabilities?: {
    canResolveImpediments?: boolean;
  };
}

/**
 * Metadata for a playbook, stored in playbook.json
 */
export interface PlaybookMetadata {
  /** Unique identifier for the playbook (kebab-case, e.g., 'plan-build') */
  id: string;
  /** Display name for the playbook */
  name: string;
  /** Short tagline describing the playbook */
  tagline: string;
  /** Detailed description of what the playbook does */
  description: string;
  /** Version string */
  version?: string;
  /** Icon identifier (Lucide icon name) */
  icon: string;
  /** Whether the playbook is active and available for use (default: true) */
  active?: boolean;
  /** Agent roles in this playbook */
  roles: PlaybookRole[];
  /** Workflow phases */
  phases?: string[];
  /** Flow description (array of step descriptions) */
  flow: string[];
  /** Description of human's role in the workflow */
  humanRole: string;
  /** List of use cases this playbook is best suited for */
  bestFor: string[];
}

/**
 * A fully loaded playbook with all content
 */
export interface Playbook {
  /** Playbook metadata from playbook.json */
  metadata: PlaybookMetadata;
  /** Protocol markdown content (shared rules for all agents) */
  protocol: string;
  /** Map of role ID to prompt markdown content */
  role_prompts: Record<string, string>;
}

/**
 * Response format for the playbooks API
 */
export interface PlaybooksManifest {
  /** List of all playbooks */
  playbooks: Playbook[];
  /** Version timestamp for cache invalidation */
  version: number;
}

/**
 * Result of validating a playbook
 */
export interface ValidationResult {
  /** Whether the playbook is valid */
  valid: boolean;
  /** List of validation errors (empty if valid) */
  errors: string[];
  /** List of validation warnings */
  warnings: string[];
}
