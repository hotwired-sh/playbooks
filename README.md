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
const playbook = loadPlaybook('critique-refine');
```

### Direct file access

The playbook files are included in the package and can be accessed directly:

```typescript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const packagePath = require.resolve('@hotwired-sh/playbooks/package.json');
// Playbooks are siblings to package.json
```

## Playbook Structure

Each playbook is a directory containing:

- `playbook.json` - Metadata (name, roles, flow, etc.)
- `protocol.md` - Shared protocol/rules for all agents
- `*.md` - Role-specific prompts

## Available Playbooks

- **critique-refine** - Iterative refinement with critic feedback
- **doc-editor** - Documentation writing and editing
- **investigate-fix** - Bug investigation and fixing
- **observe-code** - Code observation and analysis
- **plan-build** - Planning and building features
- **test-implement** - Test-driven implementation

## Creating Custom Playbooks

Fork this repository and add your own playbook directories following the same structure.

## License

MIT
