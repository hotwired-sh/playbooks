import { describe, it, expect } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePlaybook, validateAllPlaybooks } from './validate.js';
import { loadPlaybook, loadAllPlaybooks, listPlaybookIds, PLAYBOOK_IDS } from './data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLAYBOOKS_DIR = join(__dirname, '..', 'playbooks');

describe('validatePlaybook', () => {
  it('validates plan-build playbook', () => {
    const result = validatePlaybook(join(PLAYBOOKS_DIR, 'plan-build'));
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('validates doc-editor playbook', () => {
    const result = validatePlaybook(join(PLAYBOOKS_DIR, 'doc-editor'));
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error for non-existent directory', () => {
    const result = validatePlaybook(join(PLAYBOOKS_DIR, 'non-existent'));
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing playbook.json');
  });
});

describe('validateAllPlaybooks', () => {
  it('validates all playbooks in directory', () => {
    const results = validateAllPlaybooks(PLAYBOOKS_DIR);
    expect(results.size).toBeGreaterThan(0);

    for (const [id, result] of results) {
      expect(result.valid, `Playbook "${id}" should be valid`).toBe(true);
    }
  });
});

describe('loadPlaybook', () => {
  it('loads plan-build playbook', () => {
    const playbook = loadPlaybook('plan-build');
    expect(playbook).not.toBeNull();
    expect(playbook?.metadata.id).toBe('plan-build');
    expect(playbook?.metadata.roles.length).toBeGreaterThan(0);
    expect(playbook?.protocol).toBeTruthy();
  });

  it('loads doc-editor playbook', () => {
    const playbook = loadPlaybook('doc-editor');
    expect(playbook).not.toBeNull();
    expect(playbook?.metadata.id).toBe('doc-editor');
  });

  it('returns null for non-existent playbook', () => {
    const playbook = loadPlaybook('non-existent');
    expect(playbook).toBeNull();
  });
});

describe('loadAllPlaybooks', () => {
  it('loads all active playbooks', () => {
    const playbooks = loadAllPlaybooks();
    expect(playbooks.length).toBeGreaterThan(0);

    for (const playbook of playbooks) {
      expect(playbook.metadata.id).toBeTruthy();
      expect(playbook.metadata.active).not.toBe(false);
    }
  });
});

describe('listPlaybookIds', () => {
  it('returns all playbook IDs', () => {
    const ids = listPlaybookIds();
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toContain('plan-build');
    expect(ids).toContain('doc-editor');
  });
});

describe('PLAYBOOK_IDS', () => {
  it('contains expected playbooks', () => {
    expect(PLAYBOOK_IDS).toContain('plan-build');
    expect(PLAYBOOK_IDS).toContain('doc-editor');
  });
});
