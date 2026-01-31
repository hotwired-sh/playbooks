# @hotwired-sh/playbooks

Playbook definitions for Hotwired multi-agent workflows.

## Installation

```bash
npm install @hotwired-sh/playbooks
```

## Usage

### TypeScript/JavaScript

```typescript
import { loadAllPlaybooks, loadPlaybook, type Playbook } from '@hotwired-sh/playbooks';

// Load all active playbooks
const playbooks = loadAllPlaybooks();

// Load a specific playbook
const playbook = loadPlaybook('plan-build');
```

### Direct file access

The playbook files are included in the package and can be accessed directly:

```typescript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packagePath = require.resolve('@hotwired-sh/playbooks/package.json');
// Playbooks are in ./playbooks/ relative to package root
```

## Playbook Structure

Each playbook is a directory containing:

- `playbook.json` - Metadata (name, roles, flow, etc.)
- `protocol.md` - Shared protocol/rules for all agents
- `*.md` - Role-specific prompts

## Available Playbooks

- **plan-build** - Planning and building features (Strategist + Builder)
- **doc-editor** - Documentation writing and editing (Writer + Critiquer)

## Creating Custom Playbooks

Fork this repository and add your own playbook directories following the same structure in `./playbooks/`.

## License

MIT
