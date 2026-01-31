/**
 * Playbook type definitions
 *
 * These types define the structure of playbook configurations
 * used by the Hotwired multi-agent system.
 */

export interface PlaybookRole {
  id: string;
  name: string;
  role: string;
  description: string;
  prompt_file: string;
}

export interface PlaybookMetadata {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  active: boolean;
  roles: PlaybookRole[];
  flow: string[];
  human_role: string;
  best_for: string[];
}

export interface Playbook {
  metadata: PlaybookMetadata;
  protocol: string;
  role_prompts: Record<string, string>;
}

export interface PlaybooksManifest {
  playbooks: Playbook[];
  version: number;
}
