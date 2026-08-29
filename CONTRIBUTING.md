# Contributing to Method-Monitor

Thank you for your interest in contributing to Method-Monitor! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions with the community.

## Getting Started

### Prerequisites

- Node.js 25.4.0 or higher
- pnpm (managed via Corepack — see `packageManager` in `package.json`)
- Basic familiarity with TypeScript and runtime type checking concepts

### Setting Up Your Development Environment

#### Using Dev Containers (recommended)

Open this repository in VS Code with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-containers) extension installed. To get started quickly, copy the provided example devcontainer into your local config and customize it as needed.

1. Copy the example file into place:

   ```bash
   cp .devcontainer/devcontainer.example.json .devcontainer/devcontainer.json
   ```

2. Edit `.devcontainer/devcontainer.json` to add any personal VS Code extensions, settings, or environment tweaks you need. Treat this file as local and do not commit it.
3. Rebuild the container with `Dev Containers: Rebuild Container` (or `Reopen in Container`) in VS Code.

> **Important:** If you change your local `.devcontainer/devcontainer.json`, rebuild the container for changes to take effect.

#### Manually

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR-USERNAME/Method-Monitor.git
   cd Method-Monitor
   ```

3. **Install dependencies**:

   ```bash
   pnpm install
   ```

## Development Workflow

### Building the Project

```bash
pnpm build
```

This compiles the TypeScript source to JavaScript in the `dist/` directory.

### Running Tests

```bash
pnpm test
```

Tests are written using Vitest. Please ensure all tests pass before submitting a pull request.

### Type Checking

```bash
pnpm typecheck
```

Verify there are no TypeScript compilation errors, checking both source (`tsconfig.json`) and test files
(`tsconfig.test.json`).

### Linting

```bash
pnpm lint
```

The project uses [oxlint](https://oxc.rs/docs/guide/usage/linter.html) with type-aware TypeScript rules
(see `.oxlintrc.json`). Address all linting issues in your changes.

### Formatting

```bash
pnpm format        # writes formatting fixes, including organizing imports
pnpm format:check  # verifies formatting without writing (used in CI)
```

The project uses Prettier, plus `@ianvs/prettier-plugin-sort-imports` to sort/dedupe imports on format.

### Finding Issues

The previous steps can be combined into one, by using the following command (runs typecheck, lint, and a
format check)

```bash
pnpm findissues
```

## Making Changes

### Code Organization

The project is organized into logical modules:

- `src/methodMonitor.ts` — `MethodMonitor` class and public audit API.
- `src/methodWatcher.ts` — internal instrumentation and stats tracking.
- `src/audit.ts` — `Audit` result formatting and iteration utilities.
- `src/types.ts` — shared types for `Stats`, `Target`, and `TargetMap`.

### Writing Code

Follow these guidelines when contributing:

1. **Type Safety**: Leverage TypeScript's type system fully. All public functions must be properly typed.
2. **Type Tooltips**: Ensure type tooltips are descriptive and helpful. Test them in your IDE to verify clarity.
3. **Descriptive Names**: Use clear, self-documenting names for functions, variables, and types.
4. **Comments**: Use comments sparingly — code should be self-explanatory. Comments should explain _why_, not _what_.
5. **Consistency**: Match the existing code style and patterns in the codebase.

### Testing Requirements

- **Write tests** for any new functionality or bug fixes
- **Update existing tests** if you change behavior
- **Keep test coverage high** — aim for comprehensive coverage of guard functions
- Test files follow the pattern `*.test.ts` and use Vitest syntax

Example test structure:

```typescript
import { describe, expect, it } from "vitest";

import { MethodMonitor } from "./methodMonitor";

describe("MethodMonitor", () => {
  it("registerMethod wraps a standalone function and records stats", () => {
    const addOne = (x: number) => x + 1;
    const wrapped = MethodMonitor.registerMethod(addOne, 2);

    expect(wrapped).not.toBe(addOne);
    expect(wrapped(4)).toBe(5);

    const monitor = new MethodMonitor(3);
    const audit = monitor.auditSync(() => {
      wrapped(4);
    });

    const stats = audit.getStats(null, "addOne");
    expect(stats.calls).toBe(1);
  });
});
```

## Submitting Changes

### Branching

Create a descriptive branch name:

```bash
git checkout -b feature/add-async-audit
# or
git checkout -b fix/issue-description
```

### Commit Messages

Write clear, concise commit messages:

- Use the imperative mood ("add" not "added")
- Keep the first line under 50 characters
- Provide more detail in the body if needed
- Reference issues when applicable (e.g., "Closes #123")

Example:

```text
Add MethodMonitor.asyncAudit

This runs and audits a given asynchronous function and returns the audit.

Closes #45
```

### Pull Requests

1. **Push your branch** to your fork
2. **Create a pull request** against the main repository
3. **Provide a clear description** that includes:
   - What changes you made and why
   - Any breaking changes
   - Tests added or updated
   - Related issues

4. **Ensure all checks pass**:
   - Tests pass (`pnpm test`)
   - Type checking passes (`pnpm typecheck`)
   - Linting passes (`pnpm lint`)
   - Formatting is clean (`pnpm format:check`)

Before submitting, run:

```bash
pnpm prepublish
```

This runs the same checks that will run before publishing.

## Reporting Issues

When reporting bugs or suggesting features:

1. **Check existing issues** first to avoid duplicates
2. **Be specific** with reproduction steps for bugs
3. **Include your environment** (Node version, OS)
4. **Provide examples** when possible
5. **Be respectful** and constructive in your language

## Documentation

When contributing features:

- Update [README.md](README.md) if adding new public APIs or major features
- Consider the clarity of type definitions for end users

## Questions?

- Open a GitHub discussion for questions about the library
- Check existing issues and discussions first
- Be patient and respectful when seeking help

## Recognition

Contributors will be recognized in release notes and git history. We appreciate all contributions, from code to documentation to bug reports!

Thank you for helping make Method-Monitor better! 🎉
