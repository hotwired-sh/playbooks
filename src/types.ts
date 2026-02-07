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
  /**
   * Minimum Hotwired version required by this specific playbook.
   * Overrides the package-level minHotwiredVersion if specified.
   * Format: semver string (e.g., "1.15.0")
   */
  minHotwiredVersion?: string;
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
  /** Map of template name to markdown content (from templates/ directory) */
  templates?: Record<string, string>;
}

/**
 * Package metadata for source attribution
 */
export interface PackageInfo {
  /** npm package name (e.g., '@hotwired-sh/playbooks') */
  name: string;
  /** Package version */
  version: string;
  /** Package description */
  description: string;
  /** Whether this is an official Hotwired package */
  isOfficial: boolean;
  /** Package homepage URL */
  homepage?: string;
  /** Package repository URL */
  repository?: string;
  /**
   * Minimum Hotwired version required by this package.
   * If specified, Hotwired will refuse to sync/update if the app version is lower.
   * Format: semver string (e.g., "1.12.0")
   */
  minHotwiredVersion?: string;
}

/**
 * Response format for the playbooks bundle
 * This is the format of dist/playbooks.json
 */
export interface PlaybooksManifest {
  /** Package information for source attribution */
  package: PackageInfo;
  /** List of all playbooks */
  playbooks: Playbook[];
  /** Build timestamp for cache invalidation */
  buildTime: number;
  /** Schema version for forward compatibility */
  schemaVersion: 1;
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
