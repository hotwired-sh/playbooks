# Delivery Plan: {{FEATURE_NAME}}

## Source

PRD: {{PRD_SOURCE}}  <!-- Link to Linear issue, Confluence page, or local file -->

## Existing Patterns (MUST FOLLOW)

After analyzing the codebase:

- **Backend handlers**: Follow pattern in `{{EXAMPLE_HANDLER}}` - use same structure, error handling, return types
- **Frontend components**: Use existing components from `{{UI_LIB_PATH}}`, follow `{{EXAMPLE_COMPONENT}}` pattern
- **State management**: Use {{STATE_PATTERN}} like `{{EXAMPLE_STORE}}`
- **Types**: Add to existing `{{TYPES_PATH}}` structure, export from index
- **Tests**: {{TEST_PATTERN_DESCRIPTION}}

## Task Breakdown

### 1. {{COMPONENT_1_NAME}} (Worker 1 - {{REPO_1}})

- [ ] **1.1 {{TASK_TITLE}}**
  - {{What to do - be specific about files, patterns to follow}}
  - {{More details if needed}}
  - ✓ Acceptance: {{How to verify this task is done - must be testable}}

- [ ] **1.2 {{TASK_TITLE}}**
  - {{What to do}}
  - ✓ Acceptance: {{Verification criteria}}

- [ ] **1.3 {{TASK_TITLE}}**
  - {{What to do}}
  - ✓ Acceptance: {{Verification criteria}}

### 2. {{COMPONENT_2_NAME}} (Worker 2 - {{REPO_2}})

- [ ] **2.1 {{TASK_TITLE}}**
  - {{What to do}}
  - ✓ Acceptance: {{Verification criteria}}

- [ ] **2.2 {{TASK_TITLE}}**
  - {{What to do}}
  - ✓ Acceptance: {{Verification criteria}}

### 3. {{COMPONENT_3_NAME}} (Worker 3 - {{REPO_3}})

- [ ] **3.1 {{TASK_TITLE}}**
  - {{What to do}}
  - ✓ Acceptance: {{Verification criteria}}

## Interface Contracts

Define how components connect:

- **{{Component A}} → {{Component B}}**: {{Data format, API contract, or shared types}}
- **{{Component B}} → {{Component C}}**: {{Data format, API contract, or shared types}}

## Order of Operations

1. {{First thing that must complete}} (blocks: {{what it blocks}})
2. {{Second thing}} (can run in parallel with: {{what}})
3. {{Third thing}} (depends on: {{what}})
4. Integration testing after {{what}} completes

## Test Requirements

Each task MUST include tests:

- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI elements
- All tests must pass before marking task complete

## Notes

{{Any additional context, decisions made, or constraints to be aware of}}
